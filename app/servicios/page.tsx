import { CategoryPage } from "@/components/features/category-page";

export const metadata = {
  title: "Servicios - Serviteka",
  description: "Servicios de mantenimiento y reparación automotriz",
};

export default function ServiciosPage() {
  return <CategoryPage category="servicios" />;
}
