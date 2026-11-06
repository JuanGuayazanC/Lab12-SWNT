-- Esquema de referencia para el dashboard EcoTrack.
-- Ejecutar solo si la tabla emissions todavía no existe.

create table if not exists public.emissions (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  category text not null
    check (category in ('Transporte', 'Energía', 'Residuos')),
  co2_amount numeric(12,2) not null
    check (co2_amount > 0),
  created_at timestamptz not null default now()
);

alter table public.emissions enable row level security;

-- Políticas mínimas para una demostración con usuarios autenticados.
-- En producción, limitar SELECT e INSERT por organización/propietario.
create policy "Authenticated users can read emissions"
on public.emissions
for select
to authenticated
using (true);

create policy "Authenticated users can insert emissions"
on public.emissions
for insert
to authenticated
with check (true);

-- Para recibir eventos en el cliente, habilitar la tabla emissions
-- en la publicación supabase_realtime desde Database > Publications.
