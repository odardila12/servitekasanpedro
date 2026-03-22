"use client";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/features/product-grid";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { CATEGORIES, SUBCATEGORIES } from "@/lib/constants";

interface CategoryPageProps {
  category: string;
}

export function CategoryPage({ category }: CategoryPageProps) {
  // Try to find a main category first
  const categoryData = CATEGORIES.find(
    (c) => c.slug === category || c.id === category
  );

  // If not found, try to find a subcategory
  let subcategoryData: any = null;
  let parentCategory = null;

  if (!categoryData) {
    // Check if it's a subcategory like "llantas/auto"
    for (const [mainCatKey, subcats] of Object.entries(SUBCATEGORIES)) {
      const found = subcats.find((s) => s.slug === category || s.id === category);
      if (found) {
        subcategoryData = found;
        parentCategory = CATEGORIES.find((c) => c.id === mainCatKey);
        break;
      }
    }
  }

  // If neither main category nor subcategory found, show error
  if (!categoryData && !subcategoryData) {
    return (
      <div className="min-h-screen bg-[oklch(0.13_0.01_250)]">
        <Navigation />
        <main className="container mx-auto py-16">
          <h1 className="text-3xl font-bold text-white mb-4">
            Categoría no encontrada.
          </h1>
          <p className="text-gray-300">
            Lo sentimos, la categoría que buscas no existe.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // Use categoryData if it exists, otherwise use subcategoryData
  const displayData = categoryData || subcategoryData;
  const displayName = categoryData?.name || subcategoryData?.name;
  const displayDescription = categoryData?.description || subcategoryData?.description;

  return (
    <div className="min-h-screen bg-[oklch(0.13_0.01_250)]">
      <Navigation />
      <main>
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">
              {displayName}
            </h1>
            <p className="text-blue-100 text-lg">{displayDescription}</p>
          </div>
        </div>
        <ProductGrid category={category} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
