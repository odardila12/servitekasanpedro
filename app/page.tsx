import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/features/hero-section";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { ProductCardSkeleton } from "@/components/features/product-card-skeleton";

// Lazy-loaded sections for better performance
const CategoryShowcase = dynamic(
  () =>
    import("@/components/features/category-showcase").then(
      (mod) => mod.CategoryShowcase
    ),
  { loading: () => <div className="h-80 bg-surface/20 animate-pulse rounded-2xl" /> }
);

const PromoBanner = dynamic(
  () =>
    import("@/components/common/promo-banner").then((mod) => mod.PromoBanner),
  { loading: () => <div className="h-48 bg-surface/20 animate-pulse rounded-2xl" /> }
);

const ProductGrid = dynamic(
  () =>
    import("@/components/features/product-grid").then((mod) => mod.ProductGrid),
  {
    loading: () => (
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }
);

const TrustSignals = dynamic(
  () =>
    import("@/components/common/trust-signals").then((mod) => mod.TrustSignals),
  { loading: () => <div className="h-48 bg-surface/20 animate-pulse rounded-2xl" /> }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.13_0.01_250)]">
      <Navigation />
      <main>
        <HeroSection />
        <CategoryShowcase />
        <PromoBanner />
        <ProductGrid />
        <TrustSignals />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
