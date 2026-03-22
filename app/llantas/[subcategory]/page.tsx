import { CategoryPage } from "@/components/features/category-page";

export const metadata = {
  title: "Llantas - Serviteka",
  description: "Compra llantas premium para tu vehículo",
};

export default function LlantasSubcategoryPage({
  params,
}: {
  params: { subcategory: string };
}) {
  return <CategoryPage category={`llantas/${params.subcategory}`} />;
}
