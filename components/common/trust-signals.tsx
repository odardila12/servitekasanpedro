import {
  ShieldCheck,
  Truck,
  Wrench,
  CreditCard,
  RotateCcw,
  Headphones,
} from "lucide-react";

const signals = [
  {
    icon: ShieldCheck,
    title: "Pago 100% Seguro",
    description: "Encriptacion SSL en todas las transacciones",
    iconColor: "text-emerald-400",
    bgColor: "from-emerald-500/10 to-emerald-500/5",
  },
  {
    icon: Truck,
    title: "Envio Express",
    description: "Entrega en 24-48 hrs en zona metropolitana",
    iconColor: "text-blue-400",
    bgColor: "from-blue-500/10 to-blue-500/5",
  },
  {
    icon: Wrench,
    title: "Instalacion Profesional",
    description: "Servicio de instalacion incluido en tienda",
    iconColor: "text-amber-400",
    bgColor: "from-amber-500/10 to-amber-500/5",
  },
  {
    icon: CreditCard,
    title: "Meses sin Intereses",
    description: "3, 6 y 12 MSI con tarjetas participantes",
    iconColor: "text-rose-400",
    bgColor: "from-rose-500/10 to-rose-500/5",
  },
  {
    icon: RotateCcw,
    title: "Garantia Extendida",
    description: "Hasta 5 anos de garantia en productos selectos",
    iconColor: "text-violet-400",
    bgColor: "from-violet-500/10 to-violet-500/5",
  },
  {
    icon: Headphones,
    title: "Soporte Experto",
    description: "Asesores certificados disponibles para ti",
    iconColor: "text-cyan-400",
    bgColor: "from-cyan-500/10 to-cyan-500/5",
  },
];

export function TrustSignals() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight text-balance">
            Por que elegir Serviteka
          </h2>
          <p className="mt-3 text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            Mas de 20 anos de experiencia respaldan nuestra promesa de calidad,
            precio y servicio profesional.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {signals.map((signal) => (
            <div
              key={signal.title}
              className={`group glass-card rounded-2xl p-6 lg:p-8 hover:scale-[1.02] transition-all duration-500`}
            >
              <div
                className={`size-12 rounded-2xl bg-gradient-to-br ${signal.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}
              >
                <signal.icon className={`size-6 ${signal.iconColor}`} />
              </div>
              <h3 className="text-sm lg:text-base font-semibold text-white mb-1.5">
                {signal.title}
              </h3>
              <p className="text-xs lg:text-sm text-white/40 leading-relaxed">
                {signal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
