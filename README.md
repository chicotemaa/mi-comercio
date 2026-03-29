# mi-comercio-app

Panel/backoffice hecho con Next.js para administrar el mismo proyecto de Supabase que usa `ns-barber`.

## Rol del proyecto

- `ns-barber`: sitio público y formulario de reservas.
- `mi-comercio-app`: panel interno para ver agenda, servicios y equipo.
- `Supabase`: backend compartido, base de datos y RPC pública para crear reservas.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
cp .env.example .env.local
```

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
BUSINESS_SLUG=nerea-aylen-barber
```

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto compartido.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: necesaria si luego quieres sumar auth cliente.
- `SUPABASE_SERVICE_ROLE_KEY`: usada por el panel para leer datos completos en servidor.
- `BUSINESS_SLUG`: negocio que debe cargar el dashboard.

## Supabase

El esquema base y los seeds iniciales están en [supabase/schema.sql](/Users/matidev/Documents/Proyects/mi-comercio-app/supabase/schema.sql).

Ese script crea:

- `businesses`
- `profiles`
- `staff_members`
- `services`
- `appointments`
- RPC `create_public_appointment(...)`

## Scripts

```bash
npm run dev
npm run build
```

## Estado actual

- Dashboard, agenda, servicios y equipo leen desde Supabase.
- Si faltan variables o el proyecto todavía no existe, el panel entra en modo demo.
- El sitio público puede insertar reservas reales usando la RPC pública del mismo proyecto.
