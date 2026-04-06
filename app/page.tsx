'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { Categories } from '@/components/sections/Categories';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Categories />
      <FeaturedProducts />
    </div>
  );
}
