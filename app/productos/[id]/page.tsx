'use client';

import React from 'react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Button } from '@/components/common/Button';
import { Rating } from '@/components/product/Rating';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductSpecifications } from '@/components/product/ProductSpecifications';
import { ProductAvailability } from '@/components/product/ProductAvailability';
import { ProductReviews } from '@/components/product/ProductReviews';
import { DeliveryOptions } from '@/components/product/DeliveryOptions';
import { SAMPLE_PRODUCTS } from '@/lib/constants';
import { getProductExtendedData } from '@/lib/product-extended-data';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { generateBoldPaymentLink } from '@/lib/payments/bold';
import { ShieldCheck, MessageCircle, Truck, X } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === productId);
  const [quantity, setQuantity] = React.useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [toast, setToast] = React.useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const { addToCart, openCart } = useCart();

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleAddToCart = () => {
    if (!product) return;
    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
    openCart();
    showToast('Se ha agregado el producto al carrito');
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsProcessingPayment(true);
    try {
      const paymentUrl = await generateBoldPaymentLink({
        amount: product.price * quantity,
        description: `${quantity}x ${product.name}`,
        currency: 'COP',
      });

      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Hubo un error al procesar el pago. Intentá de nuevo.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Producto no encontrado
        </h1>
        <a href="/productos" className="text-primary hover:text-primary-700 underline">
          Volver a Productos
        </a>
      </div>
    );
  }

  const relatedProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const absoluteSavings = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  // Extended data: stock, specifications, productReviews
  const extendedData = getProductExtendedData(
    product.id,
    product.name,
    product.brand ?? ''
  );

  // Ensure images array is valid
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div>
      {/* Toast notification */}
      {toast.visible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-neutral-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg"
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ visible: false, message: '' })}
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="container py-4">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Productos', href: '/productos' },
            { label: product.name },
          ]}
        />
      </div>

      {/* Product Detail */}
      <div className="container mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={galleryImages} productName={product.name} />
          </div>

          {/* Details */}
          <div>
            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating != null && (
              <Rating rating={product.rating} reviews={product.reviews ?? 0} />
            )}

            {/* Availability */}
            <div className="mt-4">
              <ProductAvailability stock={extendedData.stock} />
            </div>

            {/* Price */}
            <div className="mt-5 mb-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-black text-cta">
                  ${product.price.toLocaleString('es-CO')}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-neutral-500 line-through">
                    ${product.originalPrice.toLocaleString('es-CO')}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-alert text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{discountPercent}% OFF
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Ahorras ${absoluteSavings.toLocaleString('es-CO')}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-600 mb-6">
              Producto de alta calidad con garantía y servicio al cliente
              excepcional. Envío rápido a todo el país.
            </p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-sm">Cantidad:</label>
                <div className="flex items-center border-2 border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-neutral-100 font-bold text-lg"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border-none focus:outline-none py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-neutral-100 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  AGREGAR AL CARRITO
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-[#1a3a52] text-white border-none hover:bg-[#254d6d]"
                  onClick={handleBuyNow}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'PROCESANDO...' : 'COMPRAR AHORA'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Options + Benefits — separate row, 2-col on desktop */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Delivery Options */}
          <DeliveryOptions productId={product.id} />

          {/* Right: Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <Truck size={20} className="text-[#0F3E99]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Envío Gratis</p>
                <p className="text-xs text-neutral-500">En compras mayores a $200.000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg shrink-0">
                <ShieldCheck size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Garantía Oficial</p>
                <p className="text-xs text-neutral-500">Cobertura completa durante 12 meses</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                <MessageCircle size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Soporte 24/7</p>
                <p className="text-xs text-neutral-500">Contáctanos por WhatsApp o teléfono</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications + Reviews — 2-col on desktop, stacked on mobile */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ProductSpecifications specifications={extendedData.specifications} />
          <ProductReviews reviews={extendedData.productReviews} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-neutral-50 py-12">
          <div className="container">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8">
              Productos Relacionados
            </h2>
            <ProductGrid
              products={relatedProducts}
              onAddToCart={() => showToast('Se ha agregado el producto al carrito')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
