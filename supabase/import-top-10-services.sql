-- Importación inicial basada en planilla_barberia.xlsx
-- Criterio:
-- - popularidad observada en BASE_DATOS / SERVICIOS_TOP
-- - precio base tomado de PRECIOS
-- - categorías normalizadas a: corte, coloraciones, tratamiento

with target_business as (
  select id
  from public.businesses
  where slug = 'nerea-aylen-barber'
  limit 1
),
service_source as (
  select *
  from (
    values
      ('CORTE DE HOMBRE', 'Corte masculino clásico y prolijo para mantenimiento frecuente.', 26000::numeric, 'corte', 45),
      ('CORTE Y BARBA', 'Combo de corte y perfilado de barba en una misma visita.', 30000::numeric, 'corte', 60),
      ('CORTE DE MUJER', 'Corte femenino con terminación de brushing según el servicio base del salón.', 40000::numeric, 'corte', 60),
      ('CORTE ESTANDAR', 'Servicio de corte base para clientes que buscan una opción rápida y consistente.', 23000::numeric, 'corte', 40),
      ('PERMANENTE', 'Trabajo químico de forma y textura con terminación profesional.', 67500::numeric, 'tratamiento', 150),
      ('NANOPLASTIA', 'Tratamiento de alisado y nutrición profunda con precio base para cabello corto.', 29000::numeric, 'tratamiento', 180),
      ('NUTRICION QUESTION', 'Tratamiento capilar de nutrición con secado y terminación.', 29000::numeric, 'tratamiento', 120),
      ('COLOR TOTAL', 'Aplicación de color completo con precio base para cabello corto.', 70000::numeric, 'coloraciones', 180),
      ('MECHAS BALAYAGE', 'Servicio de balayage con precio base para cabello corto.', 137000::numeric, 'coloraciones', 240),
      ('DECOLORACION GLOBAL', 'Decoloración completa con precio base para cabello corto.', 94500::numeric, 'coloraciones', 210)
  ) as values_to_insert(name, description, price, category, duration_minutes)
),
updated_services as (
  update public.services as service
  set
    description = source.description,
    price = source.price,
    category = source.category,
    duration_minutes = source.duration_minutes,
    booking_enabled = true,
    is_active = true,
    updated_at = timezone('utc', now())
  from service_source as source
  join target_business on true
  where service.business_id = target_business.id
    and lower(service.name) = lower(source.name)
  returning service.id, service.name
),
inserted_services as (
  insert into public.services (
    business_id,
    name,
    description,
    duration_minutes,
    price,
    is_active,
    display_order,
    category,
    booking_enabled,
    updated_at
  )
  select
    target_business.id,
    source.name,
    source.description,
    source.duration_minutes,
    source.price,
    true,
    row_number() over (order by source.name),
    source.category,
    true,
    timezone('utc', now())
  from target_business
  join service_source as source on true
  where not exists (
    select 1
    from public.services as service
    where service.business_id = target_business.id
      and lower(service.name) = lower(source.name)
  )
  returning id, name
),
all_target_services as (
  select service.id, service.name, service.price, service.duration_minutes
  from public.services as service
  join target_business on service.business_id = target_business.id
  join service_source as source on lower(source.name) = lower(service.name)
)
insert into public.service_price_variants (
  service_id,
  variant_name,
  variant_code,
  price,
  duration_minutes,
  is_default,
  is_active,
  display_order,
  notes,
  updated_at
)
select
  service.id,
  'Base',
  'base',
  service.price,
  service.duration_minutes,
  true,
  true,
  1,
  'Variante base importada desde planilla_barberia.xlsx.',
  timezone('utc', now())
from all_target_services as service
where not exists (
  select 1
  from public.service_price_variants as variant
  where variant.service_id = service.id
    and variant.is_default = true
);
