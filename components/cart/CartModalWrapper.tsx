'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { CartModal } from './CartModal';

export function CartModalWrapper() {
  const { isModalOpen, modalProduct, closeCartModal, openCart } = useCart();

  const handleViewCart = () => {
    openCart();
  };

  return (
    <CartModal
      isOpen={isModalOpen}
      product={modalProduct}
      onClose={closeCartModal}
      onViewCart={handleViewCart}
    />
  );
}
