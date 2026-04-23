import { MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "Puntos de Atención | Serviteka San Pedro",
  description: "Visitanos en nuestros puntos de atención en San Pedro",
};

export default function PuntosAtencion() {
  const ubicaciones = [
    {
      id: 1,
      nombre: "Serviteka San Pedro",
      direccion: "Calle Principal 123, San Pedro",
      telefono: "+57 (310) 123-4567",
      horarios:
        "Lunes a Viernes: 8:00 AM - 6:00 PM\nSábado: 9:00 AM - 4:00 PM\nDomingo: Cerrado",
      email: "contacto@servitekasanpedro.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#1a3a52] mb-4">
            Puntos de Atención
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Visitanos en nuestros ubicaciones para conocer todos nuestros
            productos y servicios de calidad.
          </p>
        </div>

        {/* Grid de Ubicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {ubicaciones.map((ubicacion) => (
            <div
              key={ubicacion.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-neutral-100"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#1a3a52] to-[#2a4a6a] p-8">
                <h2 className="text-2xl font-bold text-white">
                  {ubicacion.nombre}
                </h2>
              </div>

              {/* Card Content */}
              <div className="p-8 space-y-6">
                {/* Dirección */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#f4c430]/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#f4c430]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                      Dirección
                    </p>
                    <p className="text-neutral-800 font-medium">
                      {ubicacion.direccion}
                    </p>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#f4c430]/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#f4c430]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                      Teléfono
                    </p>
                    <a
                      href={`tel:${ubicacion.telefono}`}
                      className="text-[#1a3a52] font-medium hover:text-[#f4c430] transition-colors"
                    >
                      {ubicacion.telefono}
                    </a>
                  </div>
                </div>

                {/* Horarios */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#f4c430]/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#f4c430]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                      Horarios
                    </p>
                    <p className="text-neutral-800 text-sm whitespace-pre-line">
                      {ubicacion.horarios}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="pt-4 border-t border-neutral-200">
                  <a
                    href={`mailto:${ubicacion.email}`}
                    className="inline-block px-6 py-3 bg-[#f4c430] hover:bg-[#e0b000] text-[#1a3a52] font-bold rounded-lg transition-colors duration-300 w-full text-center"
                  >
                    Contáctanos
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mapa Section (Placeholder) */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-neutral-100">
          <div className="w-full h-96 bg-neutral-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg font-medium">
                Ubicación en mapa
              </p>
              <p className="text-neutral-400 text-sm mt-2">
                Integración de Google Maps próximamente
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#1a3a52] to-[#2a4a6a] rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-white/80 text-lg mb-8">
            Visítanos en Serviteka San Pedro y encontrá todo lo que necesitás
            para tu vehículo.
          </p>
          <button className="px-8 py-4 bg-[#f4c430] hover:bg-[#e0b000] text-[#1a3a52] font-bold rounded-lg transition-colors duration-300 text-lg">
            Consultar Disponibilidad
          </button>
        </div>
      </div>
    </div>
  );
}
