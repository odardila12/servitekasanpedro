'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { createProduct } from '@/lib/firebase/firestore';
import { Button } from '@/components/common/Button';
import { CATEGORIES } from '@/lib/constants';
import { z } from 'zod';
import Image from 'next/image';

// ── Validation schema ────────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug es obligatorio').regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  category: z.string().min(1, 'Seleccioná una categoría'),
  brand: z.string().optional(),
  price: z.number({ error: 'Ingresá un precio válido' }).positive('El precio debe ser mayor a 0'),
  originalPrice: z.number().positive().optional().or(z.literal(undefined)),
  badge: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

type ProductForm = z.infer<typeof productSchema>;

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uploadImageToS3(
  file: File,
  productId: string,
  token: string
): Promise<string> {
  // 1. Get presigned URL from API
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      productId,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Error al obtener URL de subida');
  }

  const { presignedUrl, publicUrl } = await res.json();

  // 2. PUT file directly to S3
  const uploadRes = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error('Error al subir la imagen a S3');
  }

  return publicUrl;
}

// ── Component ────────────────────────────────────────────────────────────────

const INITIAL_FORM: ProductForm = {
  name: '',
  slug: '',
  category: '',
  brand: '',
  price: 0,
  originalPrice: undefined,
  badge: '',
  description: '',
  isActive: true,
  isFeatured: false,
};

export default function NewProductoPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});
  const [mainImage, setMainImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<'main' | `gallery-${number}` | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugify(value),
    }));
  }

  function handleField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function getToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('No autenticado');
    return user.getIdToken();
  }

  // Use a temp ID for uploads before the product is saved
  const tempProductId = `temp-${Date.now()}`;

  async function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading('main');
      const token = await getToken();
      const url = await uploadImageToS3(file, tempProductId, token);
      setMainImage(url);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al subir imagen', 'error');
    } finally {
      setUploading(null);
    }
  }

  async function handleGalleryImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const available = 4 - galleryImages.length;
    const toUpload = files.slice(0, available);

    for (let i = 0; i < toUpload.length; i++) {
      try {
        setUploading(`gallery-${i}`);
        const token = await getToken();
        const url = await uploadImageToS3(toUpload[i], tempProductId, token);
        setGalleryImages((prev) => [...prev, url]);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Error al subir imagen de galería', 'error');
      }
    }
    setUploading(null);
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    const result = productSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProductForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ProductForm;
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (!mainImage) {
      showToast('Debés subir una imagen principal', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await createProduct({
        ...result.data,
        image: mainImage,
        images: galleryImages.length > 0 ? galleryImages : undefined,
        source: 'firestore',
      });
      showToast('Producto creado exitosamente');
      setTimeout(() => router.push('/admin/productos'), 1200);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al crear el producto', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/admin/productos')}
          className="text-neutral-400 hover:text-primary transition-colors text-sm"
        >
          ← Volver
        </button>
        <span className="text-neutral-400">/</span>
        <h1 className="text-2xl font-bold text-primary">Nuevo Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-neutral-800">Información básica</h2>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary ${
                  errors.name ? 'border-red-400' : 'border-neutral-100'
                }`}
                placeholder="Ej: Llanta Pirelli 195/65 R15"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleField('slug', e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary font-mono ${
                  errors.slug ? 'border-red-400' : 'border-neutral-100'
                }`}
                placeholder="llanta-pirelli-195-65-r15"
              />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleField('category', e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white ${
                    errors.category ? 'border-red-400' : 'border-neutral-100'
                  }`}
                >
                  <option value="">Seleccionar...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">Marca</label>
                <input
                  type="text"
                  value={form.brand ?? ''}
                  onChange={(e) => handleField('brand', e.target.value)}
                  className="w-full border border-neutral-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Ej: Pirelli"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">Descripción</label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => handleField('description', e.target.value)}
                rows={3}
                className="w-full border border-neutral-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                placeholder="Descripción detallada del producto..."
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-neutral-800">Precios</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">
                  Precio <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price || ''}
                  onChange={(e) => handleField('price', parseFloat(e.target.value) || 0)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary ${
                    errors.price ? 'border-red-400' : 'border-neutral-100'
                  }`}
                  placeholder="0"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">
                  Precio original (antes)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.originalPrice ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    handleField('originalPrice', isNaN(val) ? undefined : val);
                  }}
                  className="w-full border border-neutral-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="0 (opcional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">Badge</label>
              <input
                type="text"
                value={form.badge ?? ''}
                onChange={(e) => handleField('badge', e.target.value)}
                className="w-full border border-neutral-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Ej: -20%, Nuevo, Hot"
              />
            </div>
          </div>
        </div>

        {/* Right column — images + options */}
        <div className="space-y-5">
          {/* Main image */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-neutral-800">Imagen principal</h2>

            <div
              onClick={() => mainInputRef.current?.click()}
              className="relative border-2 border-dashed border-neutral-100 rounded-xl p-4 cursor-pointer hover:border-secondary transition-colors min-h-[160px] flex items-center justify-center"
            >
              {uploading === 'main' ? (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Subiendo...</span>
                </div>
              ) : mainImage ? (
                <div className="relative w-full aspect-square max-h-[200px]">
                  <Image
                    src={mainImage}
                    alt="Imagen principal"
                    fill
                    className="object-contain rounded-lg"
                    sizes="200px"
                  />
                </div>
              ) : (
                <div className="text-center text-neutral-400">
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-xs font-medium">Click o arrastrá para subir</p>
                  <p className="text-xs mt-1">JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
            <input
              ref={mainInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleMainImageChange}
            />
            {mainImage && (
              <button
                type="button"
                onClick={() => setMainImage('')}
                className="text-xs text-red-500 hover:underline"
              >
                Eliminar imagen
              </button>
            )}
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-neutral-800">
              Galería{' '}
              <span className="text-neutral-400 font-normal text-xs">
                ({galleryImages.length}/4)
              </span>
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                  <Image
                    src={img}
                    alt={`Galería ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {galleryImages.length < 4 && (
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploading !== null}
                  className="aspect-square rounded-xl border-2 border-dashed border-neutral-100 flex items-center justify-center text-neutral-400 hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50"
                >
                  {uploading?.startsWith('gallery') ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-2xl">+</span>
                  )}
                </button>
              )}
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleGalleryImageChange}
            />
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-neutral-800">Opciones</h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleField('isActive', e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-neutral-800">Activo (visible en la tienda)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleField('isFeatured', e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-neutral-800">Producto destacado</span>
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={submitting}
            className="w-full"
          >
            {submitting ? 'Guardando...' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </div>
  );
}
