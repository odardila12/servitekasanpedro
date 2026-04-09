'use client';

import { useState } from 'react';
import { Truck, Wrench, Clock } from 'lucide-react';

interface City {
  name: string;
  shippingCost: number; // 0 = free
  installationCost: number; // 0 = free
  deliveryDays: string;
}

const CITIES: City[] = [
  { name: 'Bogotá',        shippingCost: 0,     installationCost: 0,     deliveryDays: '1-2 días hábiles' },
  { name: 'Medellín',      shippingCost: 0,     installationCost: 25000, deliveryDays: '2-3 días hábiles' },
  { name: 'Cali',          shippingCost: 15000, installationCost: 25000, deliveryDays: '2-3 días hábiles' },
  { name: 'Barranquilla',  shippingCost: 20000, installationCost: 35000, deliveryDays: '3-4 días hábiles' },
  { name: 'Bucaramanga',   shippingCost: 18000, installationCost: 30000, deliveryDays: '3-4 días hábiles' },
  { name: 'Cartagena',     shippingCost: 22000, installationCost: 35000, deliveryDays: '3-5 días hábiles' },
  { name: 'Manizales',     shippingCost: 16000, installationCost: 28000, deliveryDays: '3-4 días hábiles' },
  { name: 'Pereira',       shippingCost: 16000, installationCost: 28000, deliveryDays: '3-4 días hábiles' },
  { name: 'Otra ciudad',   shippingCost: 25000, installationCost: 40000, deliveryDays: '4-6 días hábiles' },
];

interface DeliveryOptionsProps {
  productId?: string;
}

export function DeliveryOptions({ productId: _productId }: DeliveryOptionsProps) {
  const [selectedCity, setSelectedCity] = useState<City>(
    () => CITIES.find((c) => c.name === 'Barranquilla') ?? CITIES[0]
  );

  return (
    <div className="border border-neutral-200 rounded-xl p-4 space-y-3 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={18} className="text-[#0F3E99]" />
        <h3 className="font-semibold text-neutral-800 text-sm">Opciones de entrega</h3>
      </div>

      {/* City selector */}
      <div>
        <label htmlFor="delivery-city" className="text-xs text-neutral-500 block mb-1">
          Selecciona tu ciudad
        </label>
        <select
          id="delivery-city"
          value={selectedCity.name}
          onChange={(e) => {
            const city = CITIES.find((c) => c.name === e.target.value);
            if (city) setSelectedCity(city);
          }}
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0F3E99]/30 bg-white"
        >
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Shipping cost */}
      <div className="flex items-center gap-3 py-2 border-t border-neutral-100">
        <Truck size={16} className="text-neutral-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-neutral-800">
            {selectedCity.shippingCost === 0
              ? `Envío gratis a ${selectedCity.name}`
              : `Envío a ${selectedCity.name}: $${selectedCity.shippingCost.toLocaleString('es-CO')}`}
          </p>
          {selectedCity.shippingCost === 0 && (
            <p className="text-xs text-green-600 font-medium">¡Sin costo adicional!</p>
          )}
        </div>
      </div>

      {/* Installation */}
      <div className="flex items-center gap-3 py-2 border-t border-neutral-100">
        <Wrench size={16} className="text-neutral-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-neutral-800">
            {selectedCity.installationCost === 0
              ? 'Instalación gratis'
              : `Instalación: $${selectedCity.installationCost.toLocaleString('es-CO')}`}
          </p>
          {selectedCity.installationCost === 0 && (
            <p className="text-xs text-green-600 font-medium">Incluida en tu pedido</p>
          )}
        </div>
      </div>

      {/* Delivery time */}
      <div className="flex items-center gap-3 py-2 border-t border-neutral-100">
        <Clock size={16} className="text-neutral-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-neutral-800">
            Tiempo estimado: {selectedCity.deliveryDays}
          </p>
          <p className="text-xs text-neutral-500">A partir de la confirmación del pedido</p>
        </div>
      </div>
    </div>
  );
}
