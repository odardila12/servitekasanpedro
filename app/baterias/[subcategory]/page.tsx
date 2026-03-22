import { CategoryPage } from "@/components/features/category-page";

export const metadata = {
  title: "Baterías - Serviteka",
  description: "Compra baterías premium para tu vehículo",
};

export default function BateriasSubcategoryPage({
  params,
}: {
  params: { subcategory: string };
}) {
  return <CategoryPage category={`baterias/${params.subcategory}`} />;
}
