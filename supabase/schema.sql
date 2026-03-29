create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  time_zone text not null default 'America/Argentina/Cordoba',
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.businesses add column if not exists brand_initials text;
alter table public.businesses add column if not exists short_name text;
alter table public.businesses add column if not exists founded_year integer;
alter table public.businesses add column if not exists address text;
alter table public.businesses add column if not exists phone text;
alter table public.businesses add column if not exists email text;
alter table public.businesses add column if not exists website text;
alter table public.businesses add column if not exists cuit text;
alter table public.businesses add column if not exists logo_url text;
alter table public.businesses add column if not exists hero_headline text;
alter table public.businesses add column if not exists hero_copy text;
alter table public.businesses add column if not exists google_maps_query text;
alter table public.businesses add column if not exists map_lat double precision;
alter table public.businesses add column if not exists map_lng double precision;
alter table public.businesses add column if not exists instagram_handle text;
alter table public.businesses add column if not exists whatsapp_phone text;
alter table public.businesses add column if not exists updated_at timestamptz not null default timezone('utc', now());

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  full_name text not null,
  role text not null default 'owner',
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  full_name text not null,
  role text,
  email text,
  phone text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.staff_members add column if not exists bio text;
alter table public.staff_members add column if not exists image_url text;
alter table public.staff_members add column if not exists join_date date;
alter table public.staff_members add column if not exists rating numeric(3, 2) not null default 5;
alter table public.staff_members add column if not exists updated_at timestamptz not null default timezone('utc', now());

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  price numeric(10, 2) not null check (price >= 0),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.services add column if not exists category text;
alter table public.services add column if not exists image_url text;
alter table public.services add column if not exists booking_enabled boolean not null default true;
alter table public.services add column if not exists updated_at timestamptz not null default timezone('utc', now());

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'appointment_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'booking_channel'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.booking_channel as enum ('website', 'whatsapp', 'instagram', 'manual');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'customer_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.customer_status as enum ('active', 'inactive', 'vip', 'lead');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'payment_method'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.payment_method as enum ('cash', 'card', 'transfer', 'mercado_pago', 'other');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'payment_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.payment_status as enum ('pending', 'completed', 'failed', 'refunded');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'invoice_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.invoice_status as enum ('draft', 'issued', 'paid', 'overdue', 'cancelled');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'campaign_type'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.campaign_type as enum ('whatsapp', 'email');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'campaign_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.campaign_status as enum ('draft', 'scheduled', 'sent', 'failed');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'campaign_delivery_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.campaign_delivery_status as enum ('queued', 'sent', 'delivered', 'opened', 'clicked', 'failed');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'notification_type'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.notification_type as enum ('appointment', 'payment', 'cancellation', 'employee', 'campaign', 'system');
  end if;
end;
$$;

create table if not exists public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  label text not null,
  open_time time,
  close_time time,
  is_open boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.staff_member_working_hours (
  id uuid primary key default gen_random_uuid(),
  staff_member_id uuid not null references public.staff_members (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time,
  end_time time,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.staff_member_services (
  id uuid primary key default gen_random_uuid(),
  staff_member_id uuid not null references public.staff_members (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  full_name text not null,
  primary_contact text not null,
  email text,
  phone text,
  instagram_handle text,
  address text,
  notes text,
  preferred_services text[] not null default '{}',
  status public.customer_status not null default 'active',
  rating numeric(3, 2) not null default 5,
  marketing_opt_in boolean not null default false,
  last_visit_at date,
  total_appointments integer not null default 0,
  total_spent numeric(10, 2) not null default 0,
  joined_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  staff_member_id uuid references public.staff_members (id) on delete set null,
  customer_name text not null,
  customer_contact text not null,
  customer_email text,
  appointment_date date not null,
  appointment_time time not null,
  status public.appointment_status not null default 'pending',
  channel public.booking_channel not null default 'website',
  service_name_snapshot text not null,
  staff_name_snapshot text,
  price_snapshot numeric(10, 2) not null default 0,
  duration_snapshot integer not null default 30,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.appointments add column if not exists customer_id uuid references public.customers (id) on delete set null;
alter table public.appointments add column if not exists internal_notes text;
alter table public.appointments add column if not exists cancellation_reason text;
alter table public.appointments add column if not exists updated_at timestamptz not null default timezone('utc', now());

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  appointment_id uuid references public.appointments (id) on delete set null,
  number text not null,
  status public.invoice_status not null default 'draft',
  issued_at timestamptz not null default timezone('utc', now()),
  due_at timestamptz,
  paid_at timestamptz,
  subtotal numeric(10, 2) not null default 0,
  tax_amount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  description text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  appointment_id uuid references public.appointments (id) on delete set null,
  invoice_id uuid references public.invoices (id) on delete set null,
  staff_member_id uuid references public.staff_members (id) on delete set null,
  description text not null,
  amount numeric(10, 2) not null check (amount >= 0),
  method public.payment_method not null default 'cash',
  status public.payment_status not null default 'pending',
  transaction_id text,
  processed_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  type public.campaign_type not null,
  status public.campaign_status not null default 'draft',
  audience_name text not null,
  audience_filters jsonb not null default '{}'::jsonb,
  subject text,
  message text not null,
  recipients_count integer not null default 0,
  sent_count integer not null default 0,
  delivered_count integer not null default 0,
  opened_count integer not null default 0,
  clicked_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  scheduled_at timestamptz,
  sent_at timestamptz
);

create table if not exists public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  recipient_contact text not null,
  status public.campaign_delivery_status not null default 'queued',
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  message text not null,
  entity_type text,
  entity_id uuid,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  actor_profile_id uuid references public.profiles (id) on delete set null,
  actor_name_snapshot text not null,
  action text not null,
  details text,
  entity_type text,
  entity_id uuid,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.integration_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  provider text not null,
  is_enabled boolean not null default false,
  public_key text,
  secret_key text,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  email_enabled boolean not null default true,
  whatsapp_enabled boolean not null default false,
  appointment_created boolean not null default true,
  appointment_cancelled boolean not null default true,
  payment_received boolean not null default true,
  campaign_finished boolean not null default true,
  system_alerts boolean not null default true,
  daily_summary boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.team_invitations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  invited_by_profile_id uuid references public.profiles (id) on delete set null,
  email text not null,
  role text not null default 'employee',
  token text not null default encode(gen_random_bytes(18), 'hex'),
  status text not null default 'pending',
  expires_at timestamptz not null default (timezone('utc', now()) + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_services_business_id on public.services (business_id);
create index if not exists idx_staff_members_business_id on public.staff_members (business_id);
create index if not exists idx_appointments_business_id on public.appointments (business_id);
create index if not exists idx_appointments_date_time on public.appointments (appointment_date, appointment_time);
create index if not exists idx_appointments_customer_id on public.appointments (customer_id);
create index if not exists idx_business_hours_business_day on public.business_hours (business_id, day_of_week);
create index if not exists idx_staff_member_hours_member_day on public.staff_member_working_hours (staff_member_id, day_of_week);
create unique index if not exists idx_staff_member_services_unique on public.staff_member_services (staff_member_id, service_id);
create unique index if not exists idx_business_hours_unique_day on public.business_hours (business_id, day_of_week);
create unique index if not exists idx_staff_member_hours_unique_day on public.staff_member_working_hours (staff_member_id, day_of_week);
create index if not exists idx_customers_business_id on public.customers (business_id);
create unique index if not exists idx_customers_business_contact on public.customers (business_id, primary_contact);
create unique index if not exists idx_customers_business_email on public.customers (business_id, lower(email)) where email is not null;
create unique index if not exists idx_invoices_business_number on public.invoices (business_id, number);
create index if not exists idx_payments_business_id on public.payments (business_id);
create index if not exists idx_campaigns_business_id on public.campaigns (business_id);
create index if not exists idx_notifications_business_read on public.notifications (business_id, is_read);
create unique index if not exists idx_integration_settings_provider on public.integration_settings (business_id, provider);
create unique index if not exists idx_notification_preferences_business_id on public.notification_preferences (business_id);

alter table public.businesses enable row level security;
alter table public.staff_members enable row level security;
alter table public.services enable row level security;
alter table public.business_hours enable row level security;
alter table public.customers enable row level security;
alter table public.appointments enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_recipients enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.integration_settings enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.team_invitations enable row level security;
alter table public.staff_member_working_hours enable row level security;
alter table public.staff_member_services enable row level security;

drop policy if exists "Public businesses are readable" on public.businesses;
create policy "Public businesses are readable"
on public.businesses
for select
to anon, authenticated
using (true);

drop policy if exists "Public staff members are readable" on public.staff_members;
create policy "Public staff members are readable"
on public.staff_members
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public services are readable" on public.services;
create policy "Public services are readable"
on public.services
for select
to anon, authenticated
using (is_active = true and booking_enabled = true);

drop policy if exists "Public business hours are readable" on public.business_hours;
create policy "Public business hours are readable"
on public.business_hours
for select
to anon, authenticated
using (true);

create or replace function public.create_public_appointment(
  business_slug_input text,
  service_id_input uuid,
  customer_name_input text,
  customer_contact_input text,
  appointment_date_input date,
  appointment_time_input time,
  staff_member_id_input uuid default null,
  customer_email_input text default null,
  notes_input text default null
)
returns public.appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  business_row public.businesses;
  service_row public.services;
  staff_row public.staff_members;
  customer_row public.customers;
  appointment_row public.appointments;
begin
  select *
  into business_row
  from public.businesses
  where slug = business_slug_input
  limit 1;

  if business_row.id is null then
    raise exception 'business_not_found';
  end if;

  select *
  into service_row
  from public.services
  where id = service_id_input
    and business_id = business_row.id
    and is_active = true
    and booking_enabled = true
  limit 1;

  if service_row.id is null then
    raise exception 'service_not_found';
  end if;

  if staff_member_id_input is not null then
    select *
    into staff_row
    from public.staff_members
    where id = staff_member_id_input
      and business_id = business_row.id
      and is_active = true
    limit 1;

    if staff_row.id is null then
      raise exception 'staff_member_not_found';
    end if;
  end if;

  select *
  into customer_row
  from public.customers
  where business_id = business_row.id
    and (
      (
        nullif(customer_email_input, '') is not null
        and email is not null
        and lower(email) = lower(customer_email_input)
      )
      or primary_contact = customer_contact_input
    )
  limit 1;

  if customer_row.id is null then
    insert into public.customers (
      business_id,
      full_name,
      primary_contact,
      email,
      marketing_opt_in,
      joined_at
    )
    values (
      business_row.id,
      customer_name_input,
      customer_contact_input,
      nullif(customer_email_input, ''),
      false,
      timezone('utc', now())
    )
    returning *
    into customer_row;
  else
    update public.customers
    set
      full_name = customer_name_input,
      primary_contact = customer_contact_input,
      email = coalesce(nullif(customer_email_input, ''), customer_row.email),
      updated_at = timezone('utc', now())
    where id = customer_row.id
    returning *
    into customer_row;
  end if;

  insert into public.appointments (
    business_id,
    customer_id,
    service_id,
    staff_member_id,
    customer_name,
    customer_contact,
    customer_email,
    appointment_date,
    appointment_time,
    status,
    channel,
    service_name_snapshot,
    staff_name_snapshot,
    price_snapshot,
    duration_snapshot,
    notes
  )
  values (
    business_row.id,
    customer_row.id,
    service_row.id,
    staff_row.id,
    customer_name_input,
    customer_contact_input,
    nullif(customer_email_input, ''),
    appointment_date_input,
    appointment_time_input,
    'pending',
    'website',
    service_row.name,
    staff_row.full_name,
    service_row.price,
    service_row.duration_minutes,
    nullif(notes_input, '')
  )
  returning *
  into appointment_row;

  update public.customers
  set
    total_appointments = total_appointments + 1,
    preferred_services = array(
      select distinct unnest(coalesce(preferred_services, '{}') || array[service_row.name])
    ),
    updated_at = timezone('utc', now())
  where id = customer_row.id;

  insert into public.notifications (
    business_id,
    type,
    title,
    message,
    entity_type,
    entity_id
  )
  values (
    business_row.id,
    'appointment',
    'Nueva cita reservada',
    customer_name_input || ' reservó ' || service_row.name || ' para el ' || appointment_date_input || ' a las ' || appointment_time_input,
    'appointment',
    appointment_row.id
  );

  return appointment_row;
end;
$$;

grant execute on function public.create_public_appointment(
  text,
  uuid,
  text,
  text,
  date,
  time,
  uuid,
  text,
  text
) to anon, authenticated;

insert into public.businesses (
  name,
  slug,
  description,
  time_zone,
  brand_initials,
  short_name,
  founded_year,
  address,
  phone,
  email,
  website,
  cuit,
  hero_headline,
  hero_copy,
  google_maps_query,
  map_lat,
  map_lng,
  instagram_handle,
  whatsapp_phone,
  updated_at
)
values (
  'Nerea Aylen Barber',
  'nerea-aylen-barber',
  'Barberia conectada a ns-barber y mi-comercio-app.',
  'America/Argentina/Cordoba',
  'NA',
  'NA Barber',
  2021,
  '25 de Mayo 485, Resistencia, Chaco',
  '+54 362 400-0000',
  'info@nereaaylenbarber.com',
  '',
  '',
  'Barberia con estilo, detalle y atencion 1 a 1.',
  'Un espacio pensado para quienes buscan precision, constancia y una experiencia cuidada desde el primer saludo hasta el ultimo retoque.',
  '25 de Mayo 485, Resistencia, Chaco',
  -27.4472955,
  -58.9901458,
  '@nereaaylenbarber',
  '+54 362 400-0000',
  timezone('utc', now())
)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  time_zone = excluded.time_zone,
  brand_initials = excluded.brand_initials,
  short_name = excluded.short_name,
  founded_year = excluded.founded_year,
  address = excluded.address,
  phone = excluded.phone,
  email = excluded.email,
  website = excluded.website,
  cuit = excluded.cuit,
  hero_headline = excluded.hero_headline,
  hero_copy = excluded.hero_copy,
  google_maps_query = excluded.google_maps_query,
  map_lat = excluded.map_lat,
  map_lng = excluded.map_lng,
  instagram_handle = excluded.instagram_handle,
  whatsapp_phone = excluded.whatsapp_phone,
  updated_at = excluded.updated_at;

with target_business as (
  select id
  from public.businesses
  where slug = 'nerea-aylen-barber'
  limit 1
)
insert into public.business_hours (business_id, day_of_week, label, open_time, close_time, is_open)
select
  target_business.id,
  hours.day_of_week,
  hours.label,
  hours.open_time,
  hours.close_time,
  hours.is_open
from target_business
cross join (
  values
    (0, 'Domingo', null::time, null::time, false),
    (1, 'Lunes', null::time, null::time, false),
    (2, 'Martes', '11:00'::time, '22:00'::time, true),
    (3, 'Miércoles', '11:00'::time, '22:00'::time, true),
    (4, 'Jueves', '11:00'::time, '22:00'::time, true),
    (5, 'Viernes', '11:00'::time, '22:00'::time, true),
    (6, 'Sábado', '12:00'::time, '22:00'::time, true)
) as hours(day_of_week, label, open_time, close_time, is_open)
where not exists (
  select 1
  from public.business_hours
  where business_id = target_business.id
    and day_of_week = hours.day_of_week
);

with target_business as (
  select id
  from public.businesses
  where slug = 'nerea-aylen-barber'
  limit 1
)
insert into public.staff_members (
  business_id,
  full_name,
  role,
  email,
  phone,
  display_order,
  bio,
  join_date,
  rating
)
select
  target_business.id,
  'Nerea Aylen',
  'Barbera principal',
  'nerea@barber.local',
  '+54 362 400-0000',
  1,
  'Desde 2021 acompaña a cada cliente con cortes precisos, perfilados prolijos y una mirada enfocada en resaltar el estilo personal.',
  date '2021-01-01',
  4.9
from target_business
where not exists (
  select 1
  from public.staff_members
  where business_id = target_business.id
    and full_name = 'Nerea Aylen'
);

with target_staff as (
  select id
  from public.staff_members
  where full_name = 'Nerea Aylen'
  limit 1
)
insert into public.staff_member_working_hours (staff_member_id, day_of_week, start_time, end_time, is_active)
select
  target_staff.id,
  hours.day_of_week,
  hours.start_time,
  hours.end_time,
  hours.is_active
from target_staff
cross join (
  values
    (0, null::time, null::time, false),
    (1, null::time, null::time, false),
    (2, '11:00'::time, '22:00'::time, true),
    (3, '11:00'::time, '22:00'::time, true),
    (4, '11:00'::time, '22:00'::time, true),
    (5, '11:00'::time, '22:00'::time, true),
    (6, '12:00'::time, '22:00'::time, true)
) as hours(day_of_week, start_time, end_time, is_active)
where not exists (
  select 1
  from public.staff_member_working_hours
  where staff_member_id = target_staff.id
    and day_of_week = hours.day_of_week
);

with target_business as (
  select id
  from public.businesses
  where slug = 'nerea-aylen-barber'
  limit 1
)
insert into public.services (
  business_id,
  name,
  description,
  duration_minutes,
  price,
  display_order,
  category,
  booking_enabled
)
select
  target_business.id,
  values_to_insert.name,
  values_to_insert.description,
  values_to_insert.duration_minutes,
  values_to_insert.price,
  values_to_insert.display_order,
  values_to_insert.category,
  true
from target_business
cross join (
  values
    ('Corte clasico', 'Corte parejo y prolijo para mantenimiento frecuente.', 40, 15000, 1, 'Corte'),
    ('Fade / degrade', 'Laterales limpios y transicion trabajada.', 45, 18000, 2, 'Corte'),
    ('Perfilado de barba', 'Definicion de lineas y terminacion natural.', 30, 12000, 3, 'Barba'),
    ('Afeitado tradicional', 'Afeitado completo con terminacion prolija.', 35, 14000, 4, 'Barba'),
    ('Combo corte + barba', 'Servicio completo para resolver el look en una sola visita.', 60, 26000, 5, 'Combo')
) as values_to_insert(name, description, duration_minutes, price, display_order, category)
where not exists (
  select 1
  from public.services
  where business_id = target_business.id
    and name = values_to_insert.name
);

with target_staff as (
  select id, business_id
  from public.staff_members
  where full_name = 'Nerea Aylen'
  limit 1
)
insert into public.staff_member_services (staff_member_id, service_id)
select target_staff.id, service.id
from target_staff
join public.services service on service.business_id = target_staff.business_id
where service.is_active = true
  and not exists (
    select 1
    from public.staff_member_services relation
    where relation.staff_member_id = target_staff.id
      and relation.service_id = service.id
  );

with target_business as (
  select id
  from public.businesses
  where slug = 'nerea-aylen-barber'
  limit 1
)
insert into public.integration_settings (business_id, provider, is_enabled, config)
select target_business.id, provider_data.provider, false, '{}'::jsonb
from target_business
cross join (
  values
    ('mercado_pago'),
    ('unicobros'),
    ('whatsapp')
) as provider_data(provider)
where not exists (
  select 1
  from public.integration_settings setting
  where setting.business_id = target_business.id
    and setting.provider = provider_data.provider
);

with target_business as (
  select id
  from public.businesses
  where slug = 'nerea-aylen-barber'
  limit 1
)
insert into public.notification_preferences (business_id)
select target_business.id
from target_business
where not exists (
  select 1
  from public.notification_preferences preference
  where preference.business_id = target_business.id
);

insert into public.customers (
  business_id,
  full_name,
  primary_contact,
  email,
  joined_at,
  created_at,
  updated_at
)
select
  source.business_id,
  source.customer_name,
  source.customer_contact,
  source.customer_email,
  source.first_created_at,
  source.first_created_at,
  source.first_created_at
from (
  select
    appointment.business_id,
    max(appointment.customer_name) as customer_name,
    appointment.customer_contact,
    nullif(max(appointment.customer_email), '') as customer_email,
    min(appointment.created_at) as first_created_at
  from public.appointments appointment
  group by appointment.business_id, appointment.customer_contact
) as source
where not exists (
  select 1
  from public.customers customer
  where customer.business_id = source.business_id
    and (
      customer.primary_contact = source.customer_contact
      or (
        source.customer_email is not null
        and customer.email is not null
        and lower(customer.email) = lower(source.customer_email)
      )
    )
);

update public.appointments appointment
set customer_id = customer.id
from public.customers customer
where appointment.customer_id is null
  and appointment.business_id = customer.business_id
  and (
    customer.primary_contact = appointment.customer_contact
    or (
      nullif(appointment.customer_email, '') is not null
      and customer.email is not null
      and lower(customer.email) = lower(appointment.customer_email)
    )
  );

update public.customers customer
set
  total_appointments = stats.total_appointments,
  last_visit_at = stats.last_visit_at
from (
  select
    appointment.customer_id,
    count(*) filter (where appointment.status <> 'cancelled') as total_appointments,
    max(appointment.appointment_date) filter (where appointment.status = 'completed') as last_visit_at
  from public.appointments appointment
  where appointment.customer_id is not null
  group by appointment.customer_id
) as stats
where customer.id = stats.customer_id;

update public.customers customer
set total_spent = stats.total_spent
from (
  select
    payment.customer_id,
    coalesce(sum(payment.amount), 0) as total_spent
  from public.payments payment
  where payment.customer_id is not null
    and payment.status = 'completed'
  group by payment.customer_id
) as stats
where customer.id = stats.customer_id;
