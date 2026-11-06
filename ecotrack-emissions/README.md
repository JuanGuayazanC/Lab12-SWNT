# EcoTrack – Emissions Tracker

Dashboard con React, TypeScript, Vite, Tailwind CSS y Supabase.

## Ejecutar
1. Instalar Node.js 20+.
2. `npm install`
3. Copiar `.env.example` a `.env` y completar URL y clave pública de Supabase.
4. `npm run dev`
5. Para validar compilación: `npm run build`.

Nunca expongas la clave `service_role` en el frontend.

## Tabla esperada
`public.emissions`: `id` UUID, `source_name` text, `category` text (Transporte/Energía/Residuos), `co2_amount` numeric, `created_at` timestamptz. Ver `supabase/schema.sql` para un esquema de referencia y políticas de demo.

Si no configuras `.env`, se muestran datos simulados en memoria; los cambios no persisten al recargar.
