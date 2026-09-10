# Mi Comercio

Panel interno de Nerea Aylen Barber. Usa Next.js 15, React 19 y el backend Strapi del proyecto vecino `../ns-barber/backend`. Reemplaza la conexión anterior a Supabase.

## Ejecutar

1. Node.js 22 (22.22.2 o posterior dentro de esa versión mayor) y npm.
2. `npm ci`.
3. Copiar `.env.example` a `.env.local`.
4. Definir `STRAPI_URL`, `BUSINESS_SLUG=nerea-aylen-barber` y `PANEL_ORIGIN=http://localhost:3000`.
5. Iniciar Strapi y ejecutar `npm run dev` en esta carpeta.
6. Ingresar con una cuenta Users & Permissions que tenga rol **Business Manager**. La cuenta administradora de Strapi es independiente.

La contraseña se verifica en Strapi. El JWT queda en una cookie HttpOnly, con Secure en producción y SameSite=Lax; nunca se guarda en localStorage. Las rutas del panel y sus APIs requieren sesión. Las mutaciones verifican el origen de la solicitud.

## Funciones conectadas

Servicios, equipo, horarios, agenda, clientes, pagos, gastos, liquidaciones y reportes consultan Strapi. La configuración guarda los datos del negocio y las notificaciones muestran solicitudes pendientes reales. La creación y actualización de turnos se valida nuevamente dentro de una transacción del backend.

Las campañas no envían mensajes: requieren conectar un proveedor de WhatsApp/email y definir consentimiento. Se retiraron las estadísticas y acciones simuladas. Las cuentas se gestionan desde Strapi.

Los errores de conexión se muestran como errores. `DEMO_MODE=true` permite datos de ejemplo sólo en desarrollo y no desactiva la protección del acceso.

## Verificación y publicación

```sh
npm run typecheck
npm run lint
npm run build
```

El Dockerfile usa Next.js standalone. `railway.json` define `/auth` como comprobación de salud. En Railway, `PANEL_ORIGIN` debe coincidir exactamente con el origen HTTPS público; `STRAPI_URL` puede usar la red privada. Nunca incluir credenciales en variables `NEXT_PUBLIC_*`.

Usar `package-lock.json` y npm para instalaciones reproducibles. Se unificó el proyecto en un solo gestor y lockfile.

El [plan compartido](https://github.com/chicotemaa/ns-barber/blob/main/docs/vercel-deployment.md) describe los proyectos Vercel y el backend Railway. `supabase/schema.sql` se conserva como referencia: no ejecutarlo en la base de Strapi.

### Vercel

Usar el proyecto existente `mi-comercio` del equipo `matias-chicotes-projects`, conectado a `chicotemaa/mi-comercio`. El dominio previsto del panel es `app.nereaaylen.com.ar`.

En Production configurar `STRAPI_URL=https://strapi-production-9487.up.railway.app`, `BUSINESS_SLUG=nerea-aylen-barber`, `DEMO_MODE=false` y `PANEL_ORIGIN=https://app.nereaaylen.com.ar`. Vercel necesita la URL pública de Railway. En Preview usar las mismas variables de backend y dejar `PANEL_ORIGIN` sin definir para validar el origen propio del despliegue. Las mutaciones desde otros orígenes se rechazan.

Las variables son del servidor, no requieren prefijo `NEXT_PUBLIC_`. Crear un nuevo despliegue después de modificarlas. Conservar los secretos de Strapi y la base existentes; publicar el panel no requiere inicializar usuarios ni migrar datos.
