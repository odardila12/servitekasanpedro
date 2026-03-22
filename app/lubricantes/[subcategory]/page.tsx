import { CategoryPage } from "@/components/features/category-page";

export const metadata = {
  title: "Lubricantes - Serviteka",
  description: "Compra lubricantes y fluidos premium para tu vehículo",
};

export default function LubricantesSubcategoryPage({
  params,
}: {
  params: { subcategory: string };
}) {
  return <CategoryPage category={`lubricantes/${params.subcategory}`} />;
}
