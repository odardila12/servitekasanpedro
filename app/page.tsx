'use client';

import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { Categories } from '@/components/sections/Categories';
import { BrandSection } from '@/components/sections/BrandSection';
import { PaymentMethodsSection } from '@/components/sections/PaymentMethodsSection';
import { LocationSection } from '@/components/sections/LocationSection';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';

export default function Home() {
  return (
    <div>
      <HeroCarousel />
      <Categories />
      <FeaturedProducts />
      <BrandSection />
      <PaymentMethodsSection />
      <LocationSection />
    </div>
  );
}
