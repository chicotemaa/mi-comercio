# Plan de migracion del Excel al backoffice

## Hallazgos del archivo actual

Archivo revisado: `planilla_barberia.xlsx`

- Hoja operativa principal: `BASE_DATOS`
- Hoja de carga diaria: `DIA`
- Hojas derivadas: `MOVIMIENTOS`, `RESUMEN_DIARIO`, `RESUMEN_SEMANAL`, `RESUMEN_MENSUAL`, `DASHBOARD`, `ANALISIS_COSTOS`, `SERVICIOS_TOP`, `CLIENTES`, `COMISIONES`
- Hojas maestras o auxiliares: `EMPLEADOS`, `PRECIOS`, `HORAS`

Datos detectados:

- 718 movimientos en `BASE_DATOS`
- Rango de fechas: `2025-11-08` a `2026-03-27`
- 372 clientes unicos
- 25 servicios unicos
- 293 filas mezclan ventas con gastos, distribuidores o movimientos internos

Problema principal:

- El Excel usa una sola tabla para registrar ventas, pagos, gastos y distribuciones.
- Eso sirve para control manual, pero no sirve como modelo limpio para Supabase.

## Regla base

No hay que migrar hoja por hoja.

Hay que separar:

1. Datos fuente
2. Reportes derivados

Los datos fuente se guardan en tablas.
Los reportes deben salir de queries, vistas o funciones.

## Mapa: hoja Excel -> tabla Supabase -> pantalla

### 1. `EMPLEADOS`

Destino:

- `staff_members`

Pantallas:

- `/dashboard/employees`
- `/dashboard/settings` en la parte de usuarios/equipo

Notas:

- Ya existe en el esquema.
- Falta homologar los IDs manuales del Excel (`NERE`, `AGOS`) con IDs reales UUID.
- `HORAS` hoy menciona `MARTIN`, pero no existe en `EMPLEADOS`. Eso necesita limpieza antes de importar horas.

### 2. `PRECIOS`

Destino recomendado:

- `services`
- nueva tabla `service_price_variants`

Pantallas:

- `/dashboard/services`
- formulario de reservas en `ns-barber`

Notas:

- `services` ya existe.
- El Excel maneja variantes por largo: `corto`, `medio`, `largo`, `extralargo`.
- Eso no entra bien en una sola columna `price`.
- Conviene crear `service_price_variants` con algo como:
  - `service_id`
  - `variant_name`
  - `price`
  - `duration_minutes`
  - `is_default`

### 3. `CLIENTES`

Destino:

- `customers`

Pantallas:

- `/dashboard/clients`
- `/dashboard/reports`

Notas:

- Ya existe en el esquema.
- La hoja `CLIENTES` es derivada, no fuente.
- Conviene recalcularla desde movimientos reales.

### 4. `DIA`

Destino recomendado:

- `appointments`
- `payments`
- nueva tabla `expenses`
- nueva tabla `payouts`
- nueva tabla `daily_targets` si quieres conservar el objetivo diario

Pantallas:

- `/dashboard/appointments`
- `/dashboard/payments`
- futuro modulo de caja diaria

Notas:

- `DIA` parece ser la hoja de entrada manual del dia.
- Mezcla:
  - cliente
  - servicio
  - monto
  - tipo de pago
  - distribuidor
  - gasto
  - notas

Esa hoja deberia terminar convertida en una UI de "caja diaria", no en una tabla unica.

### 5. `BASE_DATOS`

Destino recomendado:

- `appointments` para servicios vendidos o reservas completadas
- `payments` para el cobro
- `expenses` para gastos
- `payouts` para distribuciones o pagos a terceros

Pantallas:

- `/dashboard/appointments`
- `/dashboard/clients`
- `/dashboard/payments`
- `/dashboard/reports`

Reglas de clasificacion:

- Si hay `Servicio` y `MontoServicio > 0`: venta de servicio
- Si hay `Distribuidor > 0`: distribucion o pago a tercero
- Si hay `Gasto > 0`: gasto
- Si el "cliente" es algo como `ALMUERZO`, `MERIENDA`, `ALQUILER`, `COMIDA`: no es cliente, es gasto o categoria interna
- Si hay `MontoServicio > 0` pero `Servicio` vacio: revisar y reclasificar manualmente o como venta libre

### 6. `HORAS`

Destino recomendado:

- nueva tabla `staff_time_logs`

Pantallas:

- `/dashboard/employees`
- futuro resumen de comisiones

Estructura sugerida:

- `staff_member_id`
- `work_date`
- `started_at`
- `ended_at`
- `hours_worked`
- `entry_type`
- `notes`

Notas:

- Hoy el esquema tiene `staff_member_working_hours`, pero eso es horario teorico semanal.
- No reemplaza los fichajes reales del Excel.

### 7. `MOVIMIENTOS`

Destino:

- no como tabla primaria

Destino tecnico:

- vista derivada desde `payments`, `expenses` y `payouts`

Pantallas:

- `/dashboard/payments`
- `/dashboard/reports`

Notas:

- Esta hoja ya es un resumen de caja diaria.
- Conviene reproducirla con SQL, no cargarla a mano.

### 8. `RESUMEN_DIARIO`

Destino:

- vista `daily_financial_summary`

Pantallas:

- `/dashboard/reports`

### 9. `RESUMEN_SEMANAL`

Destino:

- vista `weekly_financial_summary`

Pantallas:

- `/dashboard/reports`

### 10. `RESUMEN_MENSUAL`

Destino:

- vista `monthly_financial_summary`

Pantallas:

- `/dashboard/reports`
- `/dashboard`

### 11. `DASHBOARD`

Destino:

- consultas agregadas

Pantallas:

- `/dashboard`

Notas:

- No se migra como tabla.
- Debe salir de KPIs calculados sobre movimientos reales.

### 12. `ANALISIS_COSTOS`

Destino:

- consultas agregadas sobre `expenses` y `payouts`

Pantallas:

- `/dashboard/reports`
- futuro modulo financiero

### 13. `SERVICIOS_TOP`

Destino:

- vista `top_services`

Pantallas:

- `/dashboard/reports`
- `/dashboard`

### 14. `COMISIONES`

Destino recomendado:

- vista o funcion sobre `staff_time_logs`
- opcionalmente una tabla `staff_payroll_runs` si luego quieres cierres mensuales formales

Pantallas:

- `/dashboard/employees`
- futuro modulo de comisiones

## Tablas que ya existen y sirven

Ya existen en `supabase/schema.sql`:

- `businesses`
- `business_hours`
- `profiles`
- `staff_members`
- `staff_member_working_hours`
- `staff_member_services`
- `services`
- `customers`
- `appointments`
- `payments`
- `invoices`
- `invoice_items`
- `notifications`
- `campaigns`
- `campaign_recipients`
- `integration_settings`
- `notification_preferences`
- `team_invitations`
- `activity_logs`

## Tablas que faltan para reflejar el Excel real

Estas son las que mas sentido tienen agregar ahora:

### `expenses`

Para gastos reales del negocio.

Campos sugeridos:

- `id`
- `business_id`
- `expense_date`
- `category`
- `subcategory`
- `description`
- `amount`
- `payment_method`
- `vendor_name`
- `notes`
- `created_at`

Ejemplos del Excel:

- `ALMUERZO`
- `MERIENDA`
- `ALQUILER`
- `COMIDA`
- `PSICOLOGO`
- `AGUA`

### `payouts`

Para distribuciones, alquileres repartidos, pagos a terceros o retiros.

Campos sugeridos:

- `id`
- `business_id`
- `payout_date`
- `recipient_name`
- `category`
- `amount`
- `payment_method`
- `notes`
- `created_at`

Ejemplos del Excel:

- `FABIAN`
- `FLAVIO`
- `PAGO SEMANAL AGOS`

### `staff_time_logs`

Para horas trabajadas reales.

### `service_price_variants`

Para variantes por largo o tipo.

### `daily_targets`

Opcional, para el campo `OBJETIVO` de la hoja `DIA`.

## Pantalla -> fuente de datos recomendada

### `/dashboard`

Debe salir de:

- `appointments`
- `payments`
- `expenses`
- `payouts`
- `customers`

### `/dashboard/appointments`

Debe salir de:

- `appointments`
- `customers`
- `services`
- `staff_members`

### `/dashboard/services`

Debe salir de:

- `services`
- `service_price_variants`

### `/dashboard/employees`

Debe salir de:

- `staff_members`
- `staff_member_services`
- `staff_time_logs`

### `/dashboard/clients`

Debe salir de:

- `customers`
- `appointments`
- `payments`

### `/dashboard/payments`

Debe salir de:

- `payments`
- `invoices`
- `invoice_items`
- `expenses`
- `payouts`

Importante:

- Hoy `payments` solo no alcanza para representar el Excel completo.
- La pantalla de pagos deberia convertirse en una pantalla de caja y movimientos.

### `/dashboard/reports`

Debe salir de vistas o queries agregadas:

- `daily_financial_summary`
- `weekly_financial_summary`
- `monthly_financial_summary`
- `top_services`
- `top_customers`
- `staff_performance`

### `/dashboard/settings`

Debe salir de:

- `businesses`
- `business_hours`
- `integration_settings`
- `notification_preferences`
- `profiles`
- `team_invitations`

## Orden recomendado de trabajo

### Etapa 1

Conectar lo que ya esta mas cerca del modelo:

- `settings` -> `businesses`, `business_hours`
- `clients` -> `customers`
- `payments` -> `payments`

### Etapa 2

Agregar tablas que faltan para representar el Excel:

- `expenses`
- `payouts`
- `staff_time_logs`
- `service_price_variants`

### Etapa 3

Crear vistas de reportes:

- diario
- semanal
- mensual
- top servicios
- top clientes

### Etapa 4

Importar el Excel historico con reglas de clasificacion y una cola de revisiones manuales para los casos ambiguos.

## Registros del Excel que requieren revision manual

Hay varios casos donde el archivo no distingue bien entre cliente, gasto y retiro.

Ejemplos:

- `TINCHO MENSUAL`
- `PAGO SEMANAL AGOS`
- `FABIAN`
- `FLAVIO`
- `ALQ DUEÑA`
- `ALQ INM`

Esos registros no deberian importarse automaticamente a `customers`.

## Decision practica

Si queremos que `mi-comercio-app` reemplace de verdad al Excel, el siguiente paso no es tocar reportes primero.

El siguiente paso correcto es:

1. agregar `expenses`, `payouts`, `staff_time_logs` y `service_price_variants`
2. conectar `clients`, `payments` y `settings`
3. recien despues reconstruir `reports`
