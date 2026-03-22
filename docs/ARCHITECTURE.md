# Arquitectura del Proyecto Serviteka

## Visión General

Serviteka es una plataforma moderna de e-commerce para la venta de repuestos automotrices de calidad premium. Utiliza Next.js 16 con App Router y está estructurada siguiendo principios de arquitectura limpia y componentes reutilizables.

## Estructura de Carpetas

### `/app`

Contiene las páginas y rutas de la aplicación (Next.js App Router).

```
app/
├── page.tsx              # Página principal
├── llantas/
│   └── page.tsx          # Categoría: Llantas
├── baterias/
│   └── page.tsx          # Categoría: Baterías
├── lubricantes/
│   └── page.tsx          # Categoría: Lubricantes
├── accesorios/
│   └── page.tsx          # Categoría: Accesorios
├── cart/
│   └── page.tsx          # Carrito de compras (placeholder)
└── layout.tsx            # Layout raíz
```

Cada página de categoría utiliza el componente `<CategoryPage />` que hereda la estructura de navegación y footer.

### `/components`

Componentes de React organizados por tipo:

#### `ui/`
Componentes de diseño primitivos basados en Radix UI + shadcn:
- `button.tsx` - Botón reutilizable
- `input.tsx` - Campo de entrada
- `select.tsx` - Selector desplegable
- `badge.tsx` - Insignia/etiqueta
- `checkbox.tsx` - Casilla de verificación
- `label.tsx` - Etiqueta de formulario
- `slider.tsx` - Deslizador
- `sheet.tsx` - Panel lateral
- `toast.tsx` - Notificaciones

#### `features/`
Componentes de características principales de la aplicación:
- `hero-section.tsx` - Sección hero con búsqueda
- `product-grid.tsx` - Grid de productos con filtros
- `product-card.tsx` - Tarjeta individual de producto
- `category-showcase.tsx` - Showcase de categorías principales
- `category-page.tsx` - Wrapper para páginas de categoría

#### `layout/`
Componentes de estructura:
- `navigation.tsx` - Navbar principal
- `footer.tsx` - Footer de sitio

#### `common/`
Componentes comunes reutilizables:
- `promo-banner.tsx` - Banner de promoción
- `trust-signals.tsx` - Señales de confianza (seguridad, envío, etc.)
- `whatsapp-button.tsx` - Botón flotante de WhatsApp

### `/lib`

Utilidades, tipos y constantes compartidas:

```
lib/
├── utils.ts              # Funciones auxiliares (cn para tailwind)
├── constants.ts          # Datos estáticos (categorías, marcas, precios)
├── types.ts              # Tipos TypeScript globales
└── api.ts                # Configuración y helpers de API (futura)
```

**Contenido importante:**
- `constants.ts` - Define `CATEGORIES`, `BRANDS`, `PRICE_RANGES` para uso en toda la app
- `types.ts` - Interfaz `Product`, `Category`, `PriceRange`

### `/hooks`

Custom React hooks reutilizables:
- `use-mobile.ts` - Detecta dispositivo móvil
- `use-toast.ts` - Sistema de notificaciones

### `/public`

Activos estáticos:
- Imágenes de productos
- Íconos
- Otros recursos

## Stack Tecnológico

| Herramienta | Versión | Propósito |
|---|---|---|
| Next.js | 16.2.0 | Framework React con SSR/SSG |
| React | 19.2.4 | Librería UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Utilidades de estilo |
| Radix UI | Latest | Componentes headless accesibles |
| shadcn/ui | Latest | Componentes preconstructurados |
| Lucide React | Latest | Iconografía |

## Flujos de Datos

### Página Principal
```
page.tsx
├── <Navigation />
├── <HeroSection />
├── <CategoryShowcase /> → Links a /[categoría]
├── <PromoBanner />
├── <ProductGrid /> → Filtra "Todas" las categorías
├── <TrustSignals />
├── <Footer />
└── <WhatsAppButton />
```

### Página de Categoría
```
/[categoría]/page.tsx
├── <CategoryPage category="llantas|baterias|..." />
│   ├── <Navigation />
│   ├── Hero con nombre de categoría
│   ├── <ProductGrid category="llantas" /> → Filtra por categoría
│   ├── <Footer />
│   └── <WhatsAppButton />
```

### Carrito
```
/cart/page.tsx
├── <Navigation />
├── Carrito vacío (placeholder)
├── <Footer />
└── <WhatsAppButton />
```

## Convenciones

### Nombres de Archivos
- **Componentes**: `kebab-case` (ej: `product-grid.tsx`)
- **Exports**: `PascalCase` (ej: `export function ProductGrid`)
- **Archivos de utilidades**: `kebab-case` (ej: `use-mobile.ts`)

### Componentes
- **"use client"** al inicio si tienen estado o event listeners
- **Props bien tipadas** con TypeScript
- **Accesibilidad** usando Radix UI como base
- **Responsivo** con Tailwind (mobile-first)

### Imports
- **Rutas absolutas** con `@/` alias
- **Organizados**: primero Next.js, luego componentes, luego utilidades
- **Sin circular dependencies**

### Estilos
- **Tailwind CSS** para todos los estilos
- **CVA** para variantes de componentes cuando sea necesario
- **Variables CSS** para colores personalizados (oklch)

## Flujo de Filtrado de Productos

El componente `ProductGrid` implementa:
1. Filtro por categoría (si se pasa prop `category`)
2. Filtro por marca (multi-select)
3. Filtro por rango de precio
4. Búsqueda por nombre/descripción
5. Favoritos (corazón)

Datos de productos están **hardcoded** en `product-grid.tsx` (ver PRÓXIMOS PASOS para integración con BD).

## Próximos Pasos

- [ ] Integrar database (Supabase/Firebase)
- [ ] Crear API routes para productos, órdenes, usuarios
- [ ] Agregar autenticación (NextAuth.js / Clerk)
- [ ] Implementar carrito persistente con estado global (Zustand)
- [ ] Agregar checkout y pagos
- [ ] Agregar tests (Jest, Cypress)
- [ ] Mejorar SEO (metadata dinámicos)
- [ ] Agregar admin dashboard
- [ ] Analytics e integración con Segment/GA4
- [ ] Optimizaciones de rendimiento (ISR, Image optimization)

## Decisiones Arquitectónicas

### ¿Por qué App Router?
Next.js 16 recomienda App Router. Provee mejor DX con layouts anidados y mejora en bundle size.

### ¿Por qué Radix + shadcn?
- Radix UI es headless y accesible por defecto
- shadcn proporciona componentes preconstructurados sin dependencia de vendor lock-in
- Ambos se integran perfectamente con Tailwind

### ¿Por qué Tailwind CSS?
- Desarrollo más rápido con utility-first
- Menor bundle size final
- Fácil mantenimiento y consistencia visual
- Soporte para modo oscuro nativo

### ¿Por qué datos hardcoded?
Actualmente los productos están en `product-grid.tsx`. Una vez tengamos BD, migraremos a API routes con ISR.

## Cómo Agregar Nuevas Características

### Agregar una Nueva Página de Categoría
1. Crear `/app/[nueva-categoria]/page.tsx`
2. Usar componente `<CategoryPage category="nueva-categoria" />`
3. Agregar entrada a `CATEGORIES` en `lib/constants.ts`
4. Agregar configuración en `category-showcase.tsx`

### Agregar un Nuevo Componente
1. Crear archivo en `/components/[tipo]/` apropiado
2. Exportar como nombrado: `export function ComponentName()`
3. Tipar props con TypeScript
4. Usar "use client" si tiene estado
5. Importar donde sea necesario

### Agregar una Nueva Utilidad
1. Crear en `/lib/`
2. Exportar para uso en toda la app
3. Documentar si es complejo

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)
