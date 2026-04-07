'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/contexts/CartContext';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, total, itemCount } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md flex flex-col bg-[#0d2233] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#1a3a52]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <h2 className="text-xl font-bold text-white">
              Carrito
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-normal text-[#f4c430]">
                  ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="text-white/70 hover:text-[#f4c430] transition-colors duration-200 text-2xl leading-none p-1"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <span className="text-6xl">🛒</span>
              <p className="text-white/70 text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-white/40 text-sm">Agrega productos para continuar</p>
              <button
                onClick={closeCart}
                className="mt-4 px-6 py-3 bg-[#f4c430] text-[#1a3a52] font-bold rounded-xl hover:bg-yellow-300 transition-colors duration-200 text-sm"
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-[#1a3a52] rounded-xl p-3 border border-white/10"
              >
                {/* Product image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#0d2233]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-2">
                    {item.name}
                  </p>

                  {/* Price per unit */}
                  <p className="text-[#f4c430] text-xs font-medium mb-2">
                    ${item.price.toLocaleString('es-CO')} c/u
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[#f4c430]/40 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-[#0d2233] text-[#f4c430] font-bold hover:bg-[#f4c430] hover:text-[#1a3a52] transition-colors duration-200 text-lg leading-none"
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-white font-bold text-sm bg-[#0d2233] h-8 flex items-center justify-center border-x border-[#f4c430]/40">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-[#0d2233] text-[#f4c430] font-bold hover:bg-[#f4c430] hover:text-[#1a3a52] transition-colors duration-200 text-lg leading-none"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-white/40 hover:text-red-400 transition-colors duration-200 text-sm p-1"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="flex-shrink-0 flex flex-col items-end justify-between">
                  <p className="text-white font-black text-base">
                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-[#1a3a52] px-5 py-5 space-y-4">
            {/* Total row */}
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-medium text-base">Total</span>
              <span className="text-[#f4c430] font-black text-2xl">
                ${total.toLocaleString('es-CO')}
              </span>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 text-center bg-[#f4c430] text-[#1a3a52] font-black text-base rounded-xl hover:bg-yellow-300 transition-colors duration-200 shadow-lg shadow-[#f4c430]/20"
            >
              Proceder al Pago →
            </Link>

            {/* Continue shopping */}
            <button
              onClick={closeCart}
              className="block w-full py-3 text-center text-white/70 hover:text-white font-medium text-sm transition-colors duration-200 border border-white/10 rounded-xl hover:border-white/30"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
