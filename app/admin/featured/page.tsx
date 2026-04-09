'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getFeaturedProducts, deleteFeaturedProduct, restoreFeaturedProduct } from '@/app/actions/admin-products';
import { Button } from '@/components/common/Button';
import { CATEGORIES } from '@/lib/constants';
import type { Product } from '@/lib/types';

const PAGE_SIZE = 20;

export default function AdminFeaturedPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los productos destacados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Desactivar el producto "${name}"?`)) return;
    try {
      setActionLoading(id);
      await deleteFeaturedProduct(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
      );
      showToast(`"${name}" desactivado correctamente.`);
    } catch {
      showToast('Error al desactivar el producto.', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRestore(id: string, name: string) {
    try {
      setActionLoading(id);
      await restoreFeaturedProduct(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: true } : p))
      );
      showToast(`"${name}" restaurado correctamente.`);
    } catch {
      showToast('Error al restaurar el producto.', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter ? p.category === categoryFilter : true;
      return matchName && matchCat;
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Productos Destacados</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            {products.length} productos en total
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/admin/featured/new')}
        >
          + Nuevo Destacado
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-neutral-100 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-600 font-medium">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 font-medium">
          No se encontraron productos destacados.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 border-b border-neutral-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-800 w-16">Img</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-800">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-800 hidden md:table-cell">Categoría</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-800">Precio</th>
                  <th className="px-4 py-3 text-center font-semibold text-neutral-800 hidden sm:table-cell">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold text-neutral-800">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginated.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-100/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-lg">📦</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800 line-clamp-1">{product.name}</p>
                      {product.brand && (
                        <p className="text-xs text-neutral-400">{product.brand}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="capitalize text-neutral-800">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-primary">
                      ${product.price.toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {product.isActive !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/featured/${product.id}/edit`)}
                          className="text-xs font-medium text-primary hover:underline px-2 py-1"
                          disabled={actionLoading === product.id}
                        >
                          Editar
                        </button>
                        {product.isActive !== false ? (
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="text-xs font-medium text-red-500 hover:underline px-2 py-1 disabled:opacity-50"
                            disabled={actionLoading === product.id}
                          >
                            {actionLoading === product.id ? '...' : 'Desactivar'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(product.id, product.name)}
                            className="text-xs font-medium text-green-600 hover:underline px-2 py-1 disabled:opacity-50"
                            disabled={actionLoading === product.id}
                          >
                            {actionLoading === product.id ? '...' : 'Restaurar'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-neutral-400">
                Página {page} de {totalPages} — {filtered.length} productos
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-neutral-100 bg-white text-neutral-800 disabled:opacity-40 hover:bg-neutral-100 transition-colors"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-neutral-100 bg-white text-neutral-800 disabled:opacity-40 hover:bg-neutral-100 transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
