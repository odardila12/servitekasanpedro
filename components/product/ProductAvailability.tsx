import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ProductAvailabilityProps {
  stock: number;
}

export function ProductAvailability({ stock }: ProductAvailabilityProps) {
  if (stock === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 font-semibold text-sm px-3 py-1.5 rounded-full">
          <XCircle size={15} />
          Agotado
        </span>
        <span className="text-sm text-neutral-500">Producto no disponible</span>
      </div>
    );
  }

  if (stock <= 5) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 font-semibold text-sm px-3 py-1.5 rounded-full">
          <AlertCircle size={15} />
          Últimas unidades
        </span>
        <span className="text-sm text-orange-600 font-medium">Solo {stock} disponibles</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 font-semibold text-sm px-3 py-1.5 rounded-full">
        <CheckCircle size={15} />
        En stock
      </span>
      <span className="text-sm text-neutral-500">{stock} disponibles</span>
    </div>
  );
}
