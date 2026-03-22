# Guía de Instalación y Configuración - Serviteka

## Requisitos Previos

- **Node.js** 18.17+ (recomendado 20+)
- **pnpm** 8+ ([instalación](https://pnpm.io/installation))
- **Git**

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Serviteka
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno (Opcional)

Crea un archivo `.env.local` en la raíz:

```bash
# API configuration (futura)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Ejecutar en Desarrollo

```bash
pnpm dev
```

El servidor estará disponible en: **http://localhost:3000**

### Características en Desarrollo

- Hot Module Replacement (HMR) automático
- TypeScript checking en tiempo real
- Tailwind CSS JIT compilation

## Build para Producción

```bash
# Compilar
pnpm build

# Ejecutar build de producción
pnpm start
```

## Estructura de Carpetas Explicada

### `/app` - Rutas y Páginas

Cada carpeta es una ruta en el navegador:

```
app/
├── page.tsx              # GET / (página principal)
├── layout.tsx            # Layout raíz
├── llantas/
│   └── page.tsx          # GET /llantas
├── baterias/
│   └── page.tsx          # GET /baterias
├── lubricantes/
│   └── page.tsx          # GET /lubricantes
├── accesorios/
│   └── page.tsx          # GET /accesorios
└── cart/
    └── page.tsx          # GET /cart (carrito)
```

**Ejemplo**: Para agregar una ruta `/ofertas`, crearía:
```
app/ofertas/page.tsx
```

### `/components` - Componentes React

Organizados por tipo:

```
components/
├── ui/                   # Primitivos de diseño (button, input, etc.)
├── features/             # Features principales (product-grid, hero, etc.)
├── layout/               # Estructura (nav, footer)
└── common/               # Componentes comunes reutilizables
```

**Estructura de un componente**:

```typescript
// components/features/mi-componente.tsx
"use client";  // Si tiene estado/eventos

import { Button } from "@/components/ui/button";

interface MiComponenteProps {
  titulo: string;
  onClick?: () => void;
}

export function MiComponente({ titulo, onClick }: MiComponenteProps) {
  return (
    <div>
      <h2>{titulo}</h2>
      <Button onClick={onClick}>Click</Button>
    </div>
  );
}
```

### `/lib` - Utilidades y Tipos

```
lib/
├── constants.ts    # Datos estáticos (categorías, marcas)
├── types.ts        # Interfaces TypeScript
├── utils.ts        # Funciones auxiliares (cn para CSS)
└── api.ts          # Helpers para llamadas API (futura)
```

**Ejemplo de `constants.ts`**:

```typescript
export const CATEGORIES = [
  { id: "llantas", name: "Llantas", slug: "llantas", ... },
  { id: "baterias", name: "Baterías", slug: "baterias", ... },
];

export const BRANDS = ["Michelin", "Bosch", "LTH", ...];
```

### `/hooks` - Custom React Hooks

```
hooks/
├── use-mobile.ts   # Detecta si es dispositivo móvil
└── use-toast.ts    # Sistema de notificaciones
```

**Uso**:
```typescript
import { useToast } from "@/hooks/use-toast";

export function MiComponente() {
  const { toast } = useToast();

  return (
    <button onClick={() => toast({ title: "Hola!" })}>
      Notificar
    </button>
  );
}
```

## Cómo Agregar Nuevas Características

### 1. Agregar una Nueva Página de Categoría

#### Paso 1: Crear la ruta

```bash
mkdir -p app/[nueva-categoria]
```

#### Paso 2: Crear `app/[nueva-categoria]/page.tsx`

```typescript
import { CategoryPage } from "@/components/features/category-page";

export const metadata = {
  title: "Nueva Categoría - Serviteka",
  description: "Descripción de la categoría",
};

export default function Page() {
  return <CategoryPage category="nueva-categoria" />;
}
```

#### Paso 3: Actualizar `lib/constants.ts`

```typescript
export const CATEGORIES = [
  // ... categorías existentes
  {
    id: "nueva-categoria",
    name: "Nueva Categoría",
    slug: "nueva-categoria",
    description: "Descripción",
    icon: "IconName",
  },
];
```

#### Paso 4: Actualizar `category-showcase.tsx`

Agregar configuración en `categoryConfig`:

```typescript
const categoryConfig: Record<...> = {
  // ...
  "nueva-categoria": {
    count: "N+",
    gradient: "from-color/20 to-color/5",
    iconColor: "text-color",
    borderColor: "border-color/20",
  },
};
```

### 2. Agregar un Nuevo Componente

#### Paso 1: Crear el componente

```bash
# En components/features/mi-feature.tsx
```

```typescript
"use client";

interface MiFeatureProps {
  titulo: string;
}

export function MiFeature({ titulo }: MiFeatureProps) {
  return <div>{titulo}</div>;
}
```

#### Paso 2: Usar el componente

```typescript
import { MiFeature } from "@/components/features/mi-feature";

export default function Page() {
  return <MiFeature titulo="Hello" />;
}
```

### 3. Agregar una Nueva Utilidad

#### Crear `lib/mi-utilidad.ts`

```typescript
export function miFuncion(param: string): string {
  return param.toUpperCase();
}

export const miConstante = "valor";
```

#### Usar en otros archivos

```typescript
import { miFuncion } from "@/lib/mi-utilidad";
```

### 4. Agregar un Custom Hook

#### Crear `hooks/use-mi-hook.ts`

```typescript
import { useState } from "react";

export function useMiHook() {
  const [state, setState] = useState("");

  return { state, setState };
}
```

#### Usar en componentes

```typescript
"use client";

import { useMiHook } from "@/hooks/use-mi-hook";

export function MiComponente() {
  const { state, setState } = useMiHook();

  return <div>{state}</div>;
}
```

## Convenciones del Proyecto

### Nombres de Archivos

- **Componentes**: `kebab-case` (ejemplo: `product-grid.tsx`)
- **Tipos/Utilidades**: `kebab-case` (ejemplo: `mi-utilidad.ts`)
- **Exports**: `PascalCase` (ejemplo: `export function ProductGrid()`)

### TypeScript

Siempre tipar props y valores de retorno:

```typescript
interface ComponentProps {
  title: string;
  count?: number;
  onAction?: (id: string) => void;
}

export function Component({ title, count, onAction }: ComponentProps) {
  // ...
}
```

### Estilos

Usar **Tailwind CSS** exclusivamente:

```typescript
<div className="flex items-center gap-4 p-6 rounded-lg bg-slate-900">
  <p className="text-sm text-white/60">Texto</p>
</div>
```

Si necesitas variantes condicionales, usar `cn()` de `lib/utils`:

```typescript
import { cn } from "@/lib/utils";

export function Button({ variant }: { variant: "primary" | "secondary" }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg",
        variant === "primary"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-900"
      )}
    >
      Click
    </button>
  );
}
```

### Imports

Siempre usar rutas absolutas con `@/`:

```typescript
// ✓ Correcto
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ✗ Incorrecto
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
```

## Verificación de Calidad

### TypeScript

```bash
pnpm tsc --noEmit
```

### Build

```bash
pnpm build
```

## Próximos Pasos

1. **Base de Datos**: Integrar Supabase o Firebase
2. **API Routes**: Crear rutas en `/app/api/`
3. **Autenticación**: Implementar NextAuth.js o Clerk
4. **Carrito**: Usar Zustand para estado global
5. **Tests**: Agregar Jest y Cypress

## Recursos

- [Documentación de Arquitectura](docs/ARCHITECTURE.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## Troubleshooting

### "Module not found"

Verificar rutas de import con `@/`:

```typescript
// Revisar que el archivo exista
ls components/mi-componente.tsx

// Usar ruta correcta
import { MiComponente } from "@/components/mi-componente";
```

### Build falla

```bash
# Limpiar cache
rm -rf .next
pnpm install
pnpm build
```

### TypeScript errors

```bash
pnpm tsc --noEmit
# Ver errores específicos
```

## Soporte

Para preguntas o problemas, revisar la documentación en `docs/ARCHITECTURE.md` o los logs de compilación.
