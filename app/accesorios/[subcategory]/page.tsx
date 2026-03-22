import { CategoryPage } from "@/components/features/category-page";

export const metadata = {
  title: "Accesorios - Serviteka",
  description: "Compra accesorios automotrices premium",
};

export default function AccesoriosSubcategoryPage({
  params,
}: {
  params: { subcategory: string };
}) {
  return <CategoryPage category={`accesorios/${params.subcategory}`} />;
}
