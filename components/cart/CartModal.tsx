'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart, CartItem } from '@/lib/contexts/CartContext';

interface CartModalProps {
  isOpen: boolean;
  product: CartItem | null;
  onClose: () => void;
  onViewCart: () => void;
}

export function CartModal({ isOpen, product, onClose, onViewCart }: CartModalProps) {
  const { updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  React.useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  if (!isOpen || !product) return null;

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleViewCart = () => {
    // Update the quantity in cart to match modal state
    updateQuantity(product.id, quantity);
    onViewCart();
    onClose();
  };

  const handleContinueShopping = () => {
    // Update the quantity in cart to match modal state
    updateQuantity(product.id, quantity);
    onClose();
  };

  const lineTotal = product.price * quantity;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={handleContinueShopping}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmación de producto agregado"
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div className="bg-[#062854] rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={handleContinueShopping}
              className="text-white/70 hover:text-[#FFB81C] transition-colors duration-200 text-2xl leading-none"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-6">
            {/* Product image */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-[#0F3E99]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 400px"
              />
            </div>

            {/* Product info */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-xl leading-tight">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#FFB81C]">
                  ${product.price.toLocaleString('es-CO')}
                </span>
                <span className="text-white/60 text-sm">por unidad</span>
              </div>
            </div>

            {/* Quantity controls */}
            <div className="space-y-3">
              <label className="text-white/70 text-sm font-medium block">
                Cantidad
              </label>
              <div className="flex items-center gap-4 bg-[#0F3E99] rounded-xl p-4 border border-white/10">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center bg-[#062854] text-[#FFB81C] font-bold hover:bg-[#FFB81C] hover:text-[#0F3E99] transition-colors duration-200 rounded-lg text-lg leading-none"
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="flex-1 text-center bg-[#062854] text-white font-bold text-xl border border-[#FFB81C]/40 rounded-lg py-2 px-3 text-white/90"
                  min="1"
                  aria-label="Cantidad de productos"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-[#062854] text-[#FFB81C] font-bold hover:bg-[#FFB81C] hover:text-[#0F3E99] transition-colors duration-200 rounded-lg text-lg leading-none"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            {/* Line total */}
            <div className="bg-[#0F3E99] rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/70 font-medium">Subtotal</span>
                <span className="text-[#FFB81C] font-black text-2xl">
                  ${lineTotal.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleViewCart}
                className="w-full py-4 bg-[#FFB81C] text-[#0F3E99] font-black text-base rounded-xl hover:bg-yellow-300 transition-colors duration-200 shadow-lg shadow-[#FFB81C]/20"
              >
                VER CARRITO →
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full py-3 text-[#FFB81C] font-bold text-sm transition-colors duration-200 border border-[#FFB81C]/40 rounded-xl hover:border-[#FFB81C] hover:bg-[#FFB81C]/10"
              >
                CONTINUAR COMPRANDO
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
