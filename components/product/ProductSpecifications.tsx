import type { ProductSpecifications as ProductSpecificationsType } from '@/lib/types';

const SPEC_LABELS: Record<string, string> = {
  brand: 'Marca',
  size: 'Medida',
  speedRating: 'Índice de velocidad',
  warranty: 'Garantía',
  voltage: 'Voltaje',
  capacity: 'Capacidad',
  type: 'Tipo',
  viscosity: 'Viscosidad',
  volume: 'Volumen',
};

interface ProductSpecificationsProps {
  specifications: ProductSpecificationsType;
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  const entries = Object.entries(specifications).filter(
    ([, value]) => value !== undefined && value !== ''
  ) as [string, string][];

  if (entries.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-3">Especificaciones técnicas</h2>
        <p className="text-neutral-500 text-sm">No hay especificaciones disponibles.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-neutral-900 mb-3">Especificaciones técnicas</h2>
      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-100">
              <th className="text-left font-semibold text-neutral-700 px-4 py-2.5 w-1/2">
                Especificación
              </th>
              <th className="text-left font-semibold text-neutral-700 px-4 py-2.5 w-1/2">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value], index) => (
              <tr
                key={key}
                className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
              >
                <td className="px-4 py-2.5 text-neutral-600 font-medium">
                  {SPEC_LABELS[key] ?? key}
                </td>
                <td className="px-4 py-2.5 text-neutral-800">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
