'use client';

import React from 'react';
import Image from 'next/image';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Button } from '@/components/common/Button';
import { Rating } from '@/components/product/Rating';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SAMPLE_PRODUCTS } from '@/lib/constants';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { generateBoldPaymentLink } from '@/lib/payments/bold';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = SAMPLE_PRODUCTS.find((p) => p.id === productId);
  const [quantity, setQuantity] = React.useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  const handleBuyWithBold = async () => {
    if (!product) return;
    
    setIsProcessingPayment(true);
    try {
      const paymentUrl = await generateBoldPaymentLink({
        amount: product.price * quantity,
        description: `${quantity}x ${product.name}`,
        currency: 'COP'
      });
      
      // Redirect to Bold checkout
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Hubo un error al procesar el pago con Bold.');
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
        <a
          href="/productos"
          className="text-primary hover:text-primary-700 underline"
        >
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

  return (
    <div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-96 bg-neutral-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 right-4 bg-alert text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating != null && (
              <Rating rating={product.rating} reviews={product.reviews ?? 0} />
            )}

            {/* Price */}
            <div className="mt-6 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-cta">
                  ${product.price.toLocaleString('es-CO')}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-neutral-500 line-through">
                    ${product.originalPrice.toLocaleString('es-CO')}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-600 mb-8">
              Producto de alta calidad con garantia y servicio al cliente
              excepcional. Envio rapido a todo el pais.
            </p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Cantidad:</label>
                <div className="flex items-center border-2 border-neutral-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border-none focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() =>
                  alert(
                    `${quantity} unidad(es) de ${product.name} agregada(s) al carrito`
                  )
                }
              >
                AGREGAR AL CARRITO
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full bg-[#1a3a52] text-white border-none hover:bg-[#254d6d]"
                onClick={handleBuyWithBold}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'PROCESANDO...' : 'COMPRAR CON BOLD'}
              </Button>

              <Button variant="outline" size="lg" className="w-full">
                COMPARAR
              </Button>
            </div>

            {/* Info Cards */}
            <div
              className={cn(
                'mt-8 space-y-3 border-t border-neutral-200 pt-8'
              )}
            >
              <div className="flex gap-3">
                <span className="text-2xl">&#128666;</span>
                <div>
                  <p className="font-semibold">Envio Gratis</p>
                  <p className="text-sm text-neutral-600">
                    En compras mayores a $200.000
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">&#10003;</span>
                <div>
                  <p className="font-semibold">Garantia Oficial</p>
                  <p className="text-sm text-neutral-600">
                    Cobertura completa durante 12 meses
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">&#128172;</span>
                <div>
                  <p className="font-semibold">Soporte 24/7</p>
                  <p className="text-sm text-neutral-600">
                    Contactanos por WhatsApp o telefono
                  </p>
                </div>
              </div>
            </div>
          </div>
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
              onAddToCart={(id) => alert(`Producto ${id} agregado al carrito`)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
