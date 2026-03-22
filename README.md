# Serviteka - Tienda de Repuestos Automotrices Premium

Plataforma moderna de e-commerce para la venta de repuestos automotrices de calidad. Construida con Next.js 16 y tecnologías modernas.

## Características

- Catálogo organizado por categorías (Llantas, Baterías, Lubricantes, Accesorios)
- Sistema de filtrado avanzado por marca y precio
- Interfaz responsiva y optimizada para móvil
- Componentes accesibles basados en Radix UI
- Integración con WhatsApp
- Carrito de compras (en desarrollo)

## Tecnologías

- **Next.js 16** - React framework con App Router
- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Utilidades de estilo
- **Radix UI + shadcn** - Componentes accesibles
- **Lucide React** - Iconografía

## Instalación

```bash
# Clonar repositorio
git clone <repo-url>

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura de Proyecto

```
serviteka/
├── app/                    # Páginas y rutas
│   ├── page.tsx           # Página principal
│   ├── llantas/           # Categoría: Llantas
│   ├── baterias/          # Categoría: Baterías
│   ├── lubricantes/       # Categoría: Lubricantes
│   ├── accesorios/        # Categoría: Accesorios
│   └── cart/              # Carrito
├── components/            # Componentes React
│   ├── ui/               # Componentes primitivos (shadcn)
│   ├── features/         # Componentes de features
│   ├── layout/           # Componentes de layout
│   └── common/           # Componentes comunes
├── lib/                   # Utilidades y tipos
│   ├── constants.ts      # Datos estáticos
│   ├── types.ts          # Tipos TypeScript
│   ├── utils.ts          # Funciones auxiliares
│   └── api.ts            # Configuración API
├── hooks/                 # Custom React hooks
├── docs/                  # Documentación
│   └── ARCHITECTURE.md    # Guía de arquitectura
└── public/               # Activos estáticos
```

Para documentación completa, ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Desarrollo

### Agregar una nueva categoría

1. Crear `/app/[nueva-categoria]/page.tsx`
2. Actualizar `CATEGORIES` en `lib/constants.ts`
3. El sitio carga automáticamente

### Agregar un nuevo componente

1. Crear archivo en `/components/[tipo]/nombre.tsx`
2. Exportar como función nombrada
3. Importar donde sea necesario

### Compilar

```bash
pnpm build   # Build para producción
pnpm tsc --noEmit  # Verificar errores TypeScript
```

## Scripts

```bash
pnpm dev       # Ejecutar servidor de desarrollo
pnpm build     # Hacer build para producción
pnpm start     # Ejecutar build de producción
pnpm lint      # Ejecutar linter (si aplica)
```

## Próximos Pasos

- [ ] Integración con base de datos
- [ ] Sistema de autenticación
- [ ] Carrito persistente
- [ ] Procesamiento de pagos
- [ ] Admin dashboard
- [ ] Tests automatizados

## Licencia

Propietario. Todos los derechos reservados.
