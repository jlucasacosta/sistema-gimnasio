# Llevá Forja Athletic Club a producción

Guía paso a paso para convertir este demo en un sistema real para un gimnasio: base de datos, usuarios, tareas automáticas, deploy e inteligencia artificial.

> **Qué es esto y qué no es.** Este repositorio es un **demo frontend con datos de ejemplo**: no tiene backend conectado y no guarda nada. Esta guía **describe** cómo agregarle el backend. Todo el código de las secciones de abajo lo creás vos en **tu copia** del proyecto; ninguna de esas piezas vive en este repo.

**Stack que vamos a usar:** Next.js (ya está) · Supabase (base de datos + login) · Railway con pg-boss (tareas en segundo plano) · Vercel (publicar la web) · OpenAI o Gemini (IA).

**Cómo está armado el truco:** cada módulo tiene un archivo `api.ts` con funciones que hoy devuelven datos de un `data.json`. Conectar el backend es **cambiar el cuerpo de esas funciones**; el nombre, los parámetros y el tipo que devuelven **no cambian**, así que las pantallas no se tocan.

---

## 0. Qué vas a lograr, en qué orden y cuánto tarda

Seguilo en este orden: cada etapa depende de la anterior.

| # | Etapa | Qué lográs | Tiempo estimado* |
|---|-------|-----------|------------------|
| 1 | Clonar y correr local | El demo andando en tu compu | 15 min |
| 2 | Mapa del sistema | Entender qué función de `api.ts` va a qué tabla | 10 min (lectura) |
| 3 | Supabase | Tablas, seguridad (RLS), datos de ejemplo, login y los módulos leyendo de la base | 3 a 5 h |
| 4 | Railway + pg-boss | Avisos de vencimiento y estados que se actualizan solos | 1 h |
| 5 | Vercel | Tu sistema publicado en internet con dominio propio | 30 min |
| 6 | IA | Sugerencia de respuesta para las consultas de socios | 1 h |
| 7 | Seguridad | Checklist antes de cargar datos reales | 30 min |

\*Tiempos orientativos para alguien que lo hace por primera vez. No son una medición.

**Lo que vas a necesitar (revisá los planes y límites vigentes de cada servicio antes de empezar):** cuenta de GitHub, de Supabase, de Railway, de Vercel y, para la etapa 6, una API key de OpenAI o de Google AI (Gemini).

---

## 1. Clonar y correr local

### 1.1 Instalá lo básico

| Programa | Para qué | Descarga |
|----------|----------|----------|
| Node.js (versión LTS) | Correr el proyecto | https://nodejs.org |
| Git | Bajar el código | https://git-scm.com |

Verificá que quedaron instalados (abrí una terminal nueva):

```bash
node -v
git --version
```

Si cada uno devuelve un número de versión, está listo. Next.js 15 necesita Node 18.18 o mayor; con la versión LTS actual vas bien.

### 1.2 Cloná y levantá el proyecto

```bash
git clone https://github.com/jlucasacosta/sistema-gimnasio.git
cd sistema-gimnasio
npm install
npm run dev
```

Abrí http://localhost:3000. Tenés que ver el dashboard de Forja Athletic Club con las barras de ocupación moviéndose.

> Si querés subir **tu** versión a GitHub (lo vas a necesitar para Vercel y Railway), hacé un *fork* del repo desde GitHub y cloná tu fork en lugar del original. **Mantené tu fork privado cuando cargues datos reales** (ver sección 7).

### 1.3 Si algo falla: los 3 errores típicos

| Qué ves | Por qué pasa | Cómo se arregla |
|---------|--------------|-----------------|
| `node` o `npm` "no se reconoce como un comando" / `command not found` | Node no está instalado o la terminal se abrió antes de instalarlo | Instalá Node LTS, **cerrá la terminal y abrí una nueva**, volvé a probar `node -v` |
| `EADDRINUSE: address already in use :::3000` | Otro programa (u otro proyecto tuyo) ya usa el puerto 3000 | Cerrá el otro programa, o levantá este en otro puerto: `npm run dev -- -p 3001` |
| `npm install` falla con `Unsupported engine` o errores raros de versiones | Node demasiado viejo | Actualizá a la versión LTS de Node, borrá la carpeta `node_modules` y volvé a correr `npm install` |

---

## 2. Mapa de este sistema

Seis pantallas. Cinco leen datos; la de Configuración muestra el `shell/theme.ts` y no tiene `api.ts`.

| Módulo (ruta) | Funciones de `api.ts` | Claves de `data.json` | Tablas y vistas sugeridas |
|---------------|-----------------------|-----------------------|----------------------------|
| **Dashboard** (`/dashboard`) | `getAforoClub`, `getTermometro`, `getCurvaCheckins`, `getTicker` | `aforo`, `termometro`, `curva`, `ticker` | `checkins`, `club_config` + vistas `aforo_club`, `curva_checkins_hoy`, `ticker_kpis`, `clases_vista` (no tiene tablas propias: agrega las de los otros módulos) |
| **Clases** (`/agenda`) | `getClasesHoy` | `clases` | `clases`, `coaches`, `reservas` + vista `clases_vista` |
| **Conversaciones** (`/conversaciones`) | `getThreads`, `getMessages` | `threads`, `conversaciones`, `generico` | `conversaciones`, `mensajes` + vista `hilos_vista` |
| **Membresías** (`/ventas`) | `getMembresias` | `membresias` | `membresias`, `planes`, `socios` + vista `membresias_vista` |
| **Socios** (`/contactos`) | `getSocios` | `socios` | `socios`, `membresias`, `checkins` + vista `socios_vista` |
| **Configuración** (`/config`) | (ninguna) | (ninguna) | `club_config` guarda lo que hoy vive en `theme.ts`: capacidad del club, meta de check-ins y umbrales de aforo |

Dos cosas que conviene entender antes de seguir:

- **El estado de una clase se cuenta, no se guarda.** `ocupados` son las reservas en estado `reservada` o `asistio`; `waitlist` son las `lista-espera`. La vista `clases_vista` las cuenta por vos.
- **El estado de un socio sale de su membresía.** Un socio no guarda "plan" ni "estado": los toma de su membresía más reciente (vista `socios_vista`).

---

## 3. Supabase: base de datos + login

### 3.1 Creá el proyecto

1. Entrá a https://supabase.com, creá tu cuenta y hacé **New project**.
2. Elegí un nombre (por ejemplo `tu-proyecto`), una **contraseña de base de datos** (guardala en un gestor de contraseñas) y la región más cercana a tus usuarios.
3. Esperá a que termine de crearse.
4. Abrí **Project Settings > API** (o el botón **Connect** del panel). Ahí están la **URL del proyecto** y las claves. Las vas a usar en 3.5.

### 3.2 Creá las tablas, las vistas y la seguridad

Abrí **SQL Editor > New query**, pegá **todo** el bloque y apretá **Run**. Es el esquema completo: 11 tablas, 7 vistas, una función para reservar clases sin sobrevender, las políticas de seguridad y los índices.

```sql
-- ============================================================
-- Forja Athletic Club: esquema base (Supabase / Postgres)
-- Pegalo completo en Supabase > SQL Editor > New query > Run.
-- ============================================================

-- Para buscar socios por nombre sin que se ponga lento
create extension if not exists pg_trgm with schema extensions;

-- ------------------------------------------------------------
-- 1) Catálogos y configuración del club
-- ------------------------------------------------------------

-- shell/theme.ts: aforo.casi, aforo.lleno, checkinObjetivo, cupoClub
create table public.club_config (
  id integer primary key default 1 check (id = 1),         -- una sola fila
  cupo_club integer not null check (cupo_club > 0),
  checkin_objetivo integer not null check (checkin_objetivo > 0),
  umbral_casi numeric(3,2) not null default 0.60 check (umbral_casi > 0 and umbral_casi < 1),
  umbral_lleno numeric(3,2) not null default 0.85 check (umbral_lleno > 0 and umbral_lleno <= 1),
  zona_horaria text not null default 'America/Argentina/Buenos_Aires',
  check (umbral_casi < umbral_lleno)
);

-- ventas: el "plan" de cada membresía (Full Anual, Class Pass 12, etc.)
create table public.planes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  precio integer not null check (precio >= 0),             -- en pesos
  duracion_dias integer not null check (duracion_dias > 0),
  activo boolean not null default true
);

-- agenda: el coach de cada clase
create table public.coaches (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  activo boolean not null default true
);

-- ------------------------------------------------------------
-- 2) Socios, membresías y check-ins
-- ------------------------------------------------------------

-- contactos (Socio). Los ids legibles tipo "S-201" salen de una secuencia.
create sequence public.socios_codigo_seq start 300;

create table public.socios (
  id text primary key default 'S-' || nextval('public.socios_codigo_seq'),
  nombre text not null,
  documento text not null unique,                          -- "38.204.117"
  email text,
  telefono text,
  creado_en timestamptz not null default now()
);

-- ventas (Ticket). El plan y el estado de cuota del socio salen de acá (join).
create sequence public.membresias_codigo_seq start 2000;

create table public.membresias (
  id text primary key default 'M-' || nextval('public.membresias_codigo_seq'),   -- "M-1042"
  socio_id text not null references public.socios (id) on delete cascade,
  plan_id uuid not null references public.planes (id),
  monto integer not null check (monto >= 0),               -- MRR mensual, en pesos
  inicio date not null default current_date,
  vencimiento date not null,
  estado text not null default 'activo'
    check (estado in ('activo', 'por-vencer', 'vencido', 'congelado')),
  cobro text not null default 'pendiente'
    check (cobro in ('cobrado', 'pendiente', 'rechazado'))
);

-- dashboard: aforo en vivo y curva de check-ins. salida null = sigue adentro.
create table public.checkins (
  id bigint generated always as identity primary key,
  socio_id text not null references public.socios (id) on delete cascade,
  entrada timestamptz not null default now(),
  salida timestamptz,
  check (salida is null or salida >= entrada)
);

-- ------------------------------------------------------------
-- 3) Clases y reservas
-- ------------------------------------------------------------

-- agenda (ClaseAgenda)
create table public.clases (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,                                    -- "Spinning Ride"
  coach_id uuid not null references public.coaches (id),
  sala text not null,                                      -- "Cycle · Sala C"
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  cupo integer not null check (cupo > 0),
  estado text not null default 'programada'
    check (estado in ('programada', 'en-curso', 'cancelada')),
  check (hora_fin > hora_inicio)
);

-- ocupados = reservada + asistio. waitlist = lista-espera. No se guardan: se cuentan.
create table public.reservas (
  id uuid primary key default gen_random_uuid(),
  clase_id uuid not null references public.clases (id) on delete cascade,
  socio_id text not null references public.socios (id) on delete cascade,
  estado text not null default 'reservada'
    check (estado in ('reservada', 'lista-espera', 'asistio', 'no-show', 'cancelada')),
  creada_en timestamptz not null default now(),
  unique (clase_id, socio_id)
);

-- ------------------------------------------------------------
-- 4) Conversaciones con socios
-- ------------------------------------------------------------

-- conversaciones (Thread)
create table public.conversaciones (
  id uuid primary key default gen_random_uuid(),
  socio_id text references public.socios (id) on delete set null,  -- puede ser alguien que todavía no es socio
  nombre text not null,
  canal text not null default 'whatsapp',
  no_leidos integer not null default 0 check (no_leidos >= 0),
  ultimo_mensaje_en timestamptz not null default now()
);

-- conversaciones (Message). "de" porque "from" es palabra reservada en SQL.
create table public.mensajes (
  id uuid primary key default gen_random_uuid(),
  conversacion_id uuid not null references public.conversaciones (id) on delete cascade,
  de text not null check (de in ('socio', 'vos')),
  texto text not null,
  creado_en timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5) Índices útiles
-- ------------------------------------------------------------
create index socios_nombre_trgm_idx on public.socios using gin (nombre extensions.gin_trgm_ops);
create index membresias_socio_idx on public.membresias (socio_id);
create index membresias_estado_venc_idx on public.membresias (estado, vencimiento);
create index checkins_entrada_idx on public.checkins (entrada);
create index checkins_socio_idx on public.checkins (socio_id, entrada desc);
create index clases_fecha_idx on public.clases (fecha, hora_inicio);
create index reservas_clase_idx on public.reservas (clase_id, estado);
create index reservas_socio_idx on public.reservas (socio_id);
create index conversaciones_ultimo_idx on public.conversaciones (ultimo_mensaje_en desc);
create index mensajes_conv_idx on public.mensajes (conversacion_id, creado_en);

-- ------------------------------------------------------------
-- 6) Funciones y vistas que devuelven EXACTO lo que espera cada api.ts
-- ------------------------------------------------------------

-- "Hoy" según la zona horaria del club (no la del servidor, que es UTC)
create function public.hoy_club() returns date
language sql stable as $$
  select (now() at time zone zona_horaria)::date from public.club_config where id = 1
$$;

-- Medianoche del club (hoy, o hace N días) como timestamptz
create function public.inicio_dia_club(dias_atras integer default 0) returns timestamptz
language sql stable as $$
  select (date_trunc('day', now() at time zone zona_horaria) - make_interval(days => dias_atras)) at time zone zona_horaria
  from public.club_config where id = 1
$$;

-- security_invoker = true: la vista respeta el RLS de quien la consulta
create view public.clases_vista with (security_invoker = true) as
select
  c.id,
  c.fecha,
  to_char(c.hora_inicio, 'HH24:MI') as hora,
  to_char(c.hora_fin, 'HH24:MI') as fin,
  c.nombre as clase,
  co.nombre as coach,
  c.sala,
  (select count(*) from public.reservas r
    where r.clase_id = c.id and r.estado in ('reservada', 'asistio'))::int as ocupados,
  c.cupo,
  (select count(*) from public.reservas r
    where r.clase_id = c.id and r.estado = 'lista-espera')::int as waitlist,
  c.estado
from public.clases c
join public.coaches co on co.id = c.coach_id;

create view public.membresias_vista with (security_invoker = true) as
select
  m.id,
  s.nombre as socio,
  p.nombre as plan,
  m.monto,
  (m.vencimiento - public.hoy_club()) as dias,             -- negativo = vencido hace X días
  m.estado,
  m.cobro
from public.membresias m
join public.socios s on s.id = m.socio_id
join public.planes p on p.id = m.plan_id;

create view public.socios_vista with (security_invoker = true) as
select
  s.id,
  s.nombre,
  s.documento,
  coalesce(p.nombre, 'Sin plan') as plan,
  coalesce(m.estado, 'vencido') as estado,
  (select max(c.entrada) from public.checkins c where c.socio_id = s.id) as ultimo_checkin,
  m.vencimiento,
  s.email,
  s.telefono
from public.socios s
left join lateral (
  select mm.plan_id, mm.estado, mm.vencimiento
  from public.membresias mm
  where mm.socio_id = s.id
  order by mm.vencimiento desc
  limit 1
) m on true
left join public.planes p on p.id = m.plan_id;

-- conversaciones: la lista de hilos (Thread). last = texto del último mensaje.
create view public.hilos_vista with (security_invoker = true) as
select
  c.id,
  c.nombre as name,
  coalesce((select m.texto from public.mensajes m
             where m.conversacion_id = c.id order by m.creado_en desc limit 1), '') as last,
  c.ultimo_mensaje_en,
  c.no_leidos as unread
from public.conversaciones c;

-- dashboard: hero-number de aforo (AforoClub)
create view public.aforo_club with (security_invoker = true) as
select
  (select count(*) from public.checkins
    where salida is null and entrada >= public.inicio_dia_club())::int as ocupados,
  (select cupo_club from public.club_config where id = 1) as cupo,
  (select count(*) from public.checkins
    where entrada >= public.inicio_dia_club(1)
      and entrada <= now() - interval '1 day'
      and (salida is null or salida > now() - interval '1 day'))::int as ayer_misma_hora;

-- dashboard: línea-área de check-ins por franja de 2 horas (CheckinHora)
create view public.curva_checkins_hoy with (security_invoker = true) as
select
  to_char(g.hora, 'FM00') as hora,
  count(c.id)::int as checkins,
  (g.hora = (extract(hour from now() at time zone cfg.zona_horaria)::int / 2) * 2) as ahora
from public.club_config cfg
cross join generate_series(6, 22, 2) as g(hora)
left join public.checkins c
  on c.entrada >= public.inicio_dia_club()
 and (extract(hour from c.entrada at time zone cfg.zona_horaria)::int / 2) * 2 = g.hora
group by g.hora, cfg.zona_horaria
order by g.hora;

-- dashboard: la cinta de telemetría (TickerItem). Una sola fila; api.ts arma los items.
create view public.ticker_kpis with (security_invoker = true) as
select
  (select count(*) from public.checkins where entrada >= public.inicio_dia_club())::int as checkins_hoy,
  (select count(*) from public.membresias where estado in ('activo', 'por-vencer'))::int as socios_activos,
  (select count(*) from public.clases
    where fecha = public.hoy_club() and estado <> 'cancelada')::int as clases_hoy,
  (select count(*) from public.reservas r join public.clases c on c.id = r.clase_id
    where c.fecha = public.hoy_club() and r.estado = 'no-show')::int as no_shows,
  (select count(*) from public.reservas r join public.clases c on c.id = r.clase_id
    where c.fecha = public.hoy_club() and r.estado = 'lista-espera')::int as waitlist_total,
  (select coalesce(sum(monto), 0) from public.membresias where cobro = 'cobrado')::int as mrr,
  (select count(*) from public.membresias where cobro = 'rechazado')::int as debitos_rechazados,
  (select coalesce(round(100 * avg(ocupados::numeric / cupo)), 0)::int from public.clases_vista
    where fecha = public.hoy_club() and estado <> 'cancelada') as ocupacion_media;

-- Reservar sin sobrevender: bloquea la fila de la clase mientras cuenta.
-- Devuelve 'reservada' o 'lista-espera'. Se llama con supabase.rpc('reservar_clase', {...}).
create function public.reservar_clase(p_clase uuid, p_socio text) returns text
language plpgsql as $$
declare
  v_cupo integer;
  v_estado text;
  v_ocupados integer;
  v_resultado text;
begin
  select cupo, estado into v_cupo, v_estado
  from public.clases where id = p_clase for update;

  if not found then
    raise exception 'La clase no existe';
  end if;
  if v_estado = 'cancelada' then
    raise exception 'La clase está cancelada';
  end if;

  select count(*) into v_ocupados
  from public.reservas
  where clase_id = p_clase and estado in ('reservada', 'asistio');

  v_resultado := case when v_ocupados < v_cupo then 'reservada' else 'lista-espera' end;

  insert into public.reservas (clase_id, socio_id, estado)
  values (p_clase, p_socio, v_resultado);

  return v_resultado;
end;
$$;

-- ------------------------------------------------------------
-- 7) Seguridad: RLS + quién es staff
-- ------------------------------------------------------------

-- Quién puede entrar al panel. Cada usuario de Supabase Auth que cargues
-- acá es parte del equipo del club (admin, recepción o coach).
create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  rol text not null default 'recepcion' check (rol in ('admin', 'recepcion', 'coach'))
);

create function public.es_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.staff where user_id = (select auth.uid()))
$$;

revoke execute on function public.es_staff() from public, anon;
grant execute on function public.es_staff() to authenticated;

-- RLS prendido en TODAS las tablas. Sin política = nadie entra (ni anon).
alter table public.staff enable row level security;
alter table public.club_config enable row level security;
alter table public.planes enable row level security;
alter table public.coaches enable row level security;
alter table public.socios enable row level security;
alter table public.membresias enable row level security;
alter table public.checkins enable row level security;
alter table public.clases enable row level security;
alter table public.reservas enable row level security;
alter table public.conversaciones enable row level security;
alter table public.mensajes enable row level security;

-- Políticas de ejemplo: el staff autenticado hace todo; cada uno ve solo su fila en staff.
create policy "staff ve su propia fila" on public.staff
  for select to authenticated using (user_id = (select auth.uid()));

create policy "staff total" on public.club_config
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.planes
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.coaches
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.socios
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.membresias
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.checkins
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.clases
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.reservas
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.conversaciones
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));
create policy "staff total" on public.mensajes
  for all to authenticated using ((select public.es_staff())) with check ((select public.es_staff()));

-- Permisos de tabla para el rol que usa la app logueada (RLS decide la fila)
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
```

Qué hace cada parte, para que sepas qué estás ejecutando:

- **Tablas.** Los nombres de columna siguen las claves reales de cada `data.json` (`nombre`, `documento`, `monto`, `vencimiento`, `ocupados`, `waitlist`...). Cuando una columna del JSON es un texto calculado (como `"hace 8d"` o `"02 jul"`), en la base se guarda el dato real (`timestamptz`, `date`) y el texto se arma en el código (3.9).
- **Estados como `CHECK`.** La base rechaza cualquier valor que no sea uno de los reales:

  | Dónde | Valores permitidos |
  |-------|--------------------|
  | `membresias.estado` | `activo`, `por-vencer`, `vencido`, `congelado` |
  | `membresias.cobro` | `cobrado`, `pendiente`, `rechazado` |
  | `clases.estado` | `programada`, `en-curso`, `cancelada` |
  | `reservas.estado` | `reservada`, `lista-espera`, `asistio`, `no-show`, `cancelada` |
  | `mensajes.de` | `socio`, `vos` |
  | `staff.rol` | `admin`, `recepcion`, `coach` |

- **Vistas.** Cada vista devuelve **exactamente** la forma que espera su `api.ts` (por eso las funciones casi no necesitan transformar nada). Están creadas con `security_invoker = true`: respetan la seguridad de quien las consulta.
- **`reservar_clase`.** Bloquea la fila de la clase mientras cuenta los lugares, así dos personas reservando a la vez no pueden pasarse del cupo. Devuelve `reservada` o `lista-espera`. Se llama con `supabase.rpc('reservar_clase', { p_clase, p_socio })`.
- **RLS y `staff`.** Todas las tablas tienen `row level security` prendido. Sin política, **nadie** puede leer ni escribir. La política de ejemplo deja entrar solo a los usuarios que estén en la tabla `staff` (el equipo del club). Es el patrón recomendado: aunque alguien logre registrarse, no ve nada si no lo sumaste a `staff`.
- **Zona horaria.** Las funciones `hoy_club()` e `inicio_dia_club()` calculan "hoy" según `club_config.zona_horaria` (por defecto Buenos Aires), no según el reloj del servidor, que está en UTC.

> **Cómo comprobar que salió bien:** en **Table Editor** tenés que ver las 11 tablas y, en cada una, el candado de RLS activado. Probá también los **Advisors** de seguridad del panel: no debería avisarte de tablas sin RLS.

> **Nota sobre este SQL.** Lo ejecutamos de punta a punta en un Postgres de prueba (PGlite) con el esquema `auth` simulado, y verificamos las vistas, los `CHECK`, el bloqueo de `anon` y el comportamiento de `es_staff()`. No lo corrimos contra un proyecto real de Supabase. Si algo falla en el tuyo, ejecutalo por secciones (cada una tiene su cabecera) y leé el mensaje de error.

### 3.3 Cargá los datos de ejemplo

Tenés dos caminos:

- **A. Script (recomendado).** Respeta las relaciones entre tablas (a cada membresía le busca su socio y su plan). Es el que sigue esta guía.
- **B. Importar CSV desde el Table Editor.** Sirve para tablas sueltas como `planes` o `coaches`, pero con `membresias`, `reservas` o `mensajes` tenés que resolver los ids a mano. No lo recomendamos para el set completo.

Para el script, creá la carpeta `scripts/` en tu copia, guardá este archivo como `scripts/seed.mjs`:

```js
// scripts/seed.mjs
// Carga los datos de ejemplo (modules/*/data.json) en TU proyecto de Supabase.
// Corrélo UNA vez, en un proyecto de prueba y con las tablas vacías:
//   node --env-file=.env.local scripts/seed.mjs
// Usa la clave service_role: vive solo en .env.local de tu compu, nunca en el frontend.
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

const leer = (modulo) => JSON.parse(readFileSync(`modules/${modulo}/data.json`, 'utf8'))
const ok = ({ data, error }, paso) => {
  if (error) throw new Error(`${paso}: ${error.message}`)
  return data
}

// "Hoy" en Argentina (UTC-3 todo el año) como YYYY-MM-DD
const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })
const sumarDias = (iso, n) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
const aTimestamp = (hhmm) => `${hoy}T${hhmm}:00-03:00` // "17:24" -> hoy a las 17:24 del club
// El mock usa "17:24" o "Ayer" como hora de un hilo
const cuando = (etiqueta) =>
  /^\d{1,2}:\d{2}$/.test(etiqueta) ? aTimestamp(etiqueta.padStart(5, '0')) : `${sumarDias(hoy, -1)}T12:00:00-03:00`

// Guarda: si ya hay socios, no seguimos (evita duplicar)
const previos = await supabase.from('socios').select('id', { count: 'exact', head: true })
if (previos.error) throw new Error(`socios: ${previos.error.message}`)
if ((previos.count ?? 0) > 0) throw new Error('Ya hay socios cargados. El seed es para una base vacía.')

const dashboard = leer('dashboard')
const agenda = leer('agenda').clases
const socios = leer('contactos').socios
const ventas = leer('ventas').membresias
const { threads, conversaciones, generico } = leer('conversaciones')

// 1) Config del club (shell/theme.ts: cupoClub y checkinObjetivo)
ok(await supabase.from('club_config').upsert({ id: 1, cupo_club: dashboard.aforo.cupo, checkin_objetivo: 520 }), 'club_config')

// 2) Planes: el precio sale del monto de cada membresía del mock
const precioPlan = new Map(ventas.map((v) => [v.plan, v.monto]))
const duracionPlan = { 'Full Anual': 365, 'Premium Trimestral': 90 } // el resto: 30 días
const planes = ok(
  await supabase
    .from('planes')
    .insert([...precioPlan].map(([nombre, precio]) => ({ nombre, precio, duracion_dias: duracionPlan[nombre] ?? 30 })))
    .select('id, nombre'),
  'planes'
)
const planId = new Map(planes.map((p) => [p.nombre, p.id]))

// 3) Coaches
const nombresCoach = [...new Set([...agenda.map((c) => c.coach), ...dashboard.termometro.map((c) => c.coach)])]
const coaches = ok(await supabase.from('coaches').insert(nombresCoach.map((nombre) => ({ nombre }))).select('id, nombre'), 'coaches')
const coachId = new Map(coaches.map((c) => [c.nombre, c.id]))

// 4) Socios (conservan sus ids S-201...)
ok(
  await supabase.from('socios').insert(
    socios.map((s) => ({ id: s.id, nombre: s.nombre, documento: s.documento, email: s.email, telefono: s.telefono }))
  ),
  'socios'
)
const socioId = new Map(socios.map((s) => [s.nombre, s.id]))
const idsSocios = socios.map((s) => s.id)

// 5) Membresías: "dias" del mock -> fecha de vencimiento real (hoy + días)
ok(
  await supabase.from('membresias').insert(
    ventas.map((v) => {
      const vencimiento = sumarDias(hoy, v.dias)
      return {
        id: v.id,
        socio_id: socioId.get(v.socio),
        plan_id: planId.get(v.plan),
        monto: v.monto,
        inicio: sumarDias(vencimiento, -(duracionPlan[v.plan] ?? 30)),
        vencimiento,
        estado: v.estado,
        cobro: v.cobro,
      }
    })
  ),
  'membresias'
)

// 6) Clases de hoy
const clasesDb = ok(
  await supabase
    .from('clases')
    .insert(
      agenda.map((c) => ({
        nombre: c.clase,
        coach_id: coachId.get(c.coach),
        sala: c.sala,
        fecha: hoy,
        hora_inicio: c.hora,
        hora_fin: c.fin,
        cupo: c.cupo,
        estado: c.estado,
      }))
    )
    .select('id, nombre, sala, hora_inicio'),
  'clases'
)
const claveClase = (nombre, sala, hora) => `${hora.slice(0, 5)}|${nombre}|${sala}`
const claseId = new Map(clasesDb.map((c) => [claveClase(c.nombre, c.sala, c.hora_inicio), c.id]))

// 7) Reservas: "ocupados" y "waitlist" del mock -> socios reales rotando por la lista
const reservas = []
agenda.forEach((c, i) => {
  const id = claseId.get(claveClase(c.clase, c.sala, c.hora))
  for (let k = 0; k < c.ocupados + c.waitlist; k++) {
    reservas.push({
      clase_id: id,
      socio_id: idsSocios[(i * 7 + k) % idsSocios.length],
      estado: k < c.ocupados ? 'reservada' : 'lista-espera',
    })
  }
})
ok(await supabase.from('reservas').insert(reservas), 'reservas')

// 8) Check-ins de hoy: la curva del mock define cuántos hay en cada franja de 2 horas.
//    En la franja "ahora" los primeros N quedan adentro (salida = null) = aforo en vivo.
const checkins = []
let adentro = dashboard.aforo.ocupados
dashboard.curva.forEach((f) => {
  for (let i = 0; i < f.checkins; i++) {
    const minutos = Number(f.hora) * 60 + ((i * 7) % 120)
    const hhmm = `${String(Math.floor(minutos / 60) % 24).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`
    const entrada = new Date(aTimestamp(hhmm))
    const sigueAdentro = f.ahora && adentro > 0
    if (sigueAdentro) adentro--
    checkins.push({
      socio_id: idsSocios[(checkins.length * 3) % idsSocios.length],
      entrada: entrada.toISOString(),
      salida: sigueAdentro ? null : new Date(entrada.getTime() + 60 * 60 * 1000).toISOString(),
    })
  }
})
ok(await supabase.from('checkins').insert(checkins), 'checkins')

// 9) Conversaciones y mensajes
const convsDb = ok(
  await supabase
    .from('conversaciones')
    .insert(
      threads.map((t) => ({
        socio_id: socioId.get(t.name) ?? null,
        nombre: t.name,
        canal: 'whatsapp',
        no_leidos: t.unread,
        ultimo_mensaje_en: new Date(cuando(t.time)).toISOString(),
      }))
    )
    .select('id, nombre'),
  'conversaciones'
)
const convId = new Map(convsDb.map((c) => [c.nombre, c.id]))
const mensajes = threads.flatMap((t) =>
  (conversaciones[t.id] ?? generico).map((m) => ({
    conversacion_id: convId.get(t.name),
    de: m.from,
    texto: m.text,
    creado_en: new Date(cuando(m.time)).toISOString(),
  }))
)
ok(await supabase.from('mensajes').insert(mensajes), 'mensajes')

console.log('Listo: datos de ejemplo cargados.')
```

Antes de correrlo necesitás las variables de la sección 3.5 y la librería de Supabase (3.6). Después:

```bash
node --env-file=.env.local scripts/seed.mjs
```

El script usa la clave `service_role`, por eso **solo se corre en tu compu**, con tu `.env.local`. Tiene un freno: si ya hay socios cargados, no hace nada, para no duplicar ni mezclarse con datos reales. **Usalo solo en un proyecto de prueba.**

Qué esperar: unas 30 personas, 28 membresías, 19 clases con sus reservas y lista de espera, 520 check-ins de hoy y 14 conversaciones. Dos socios quedan sin membresía a propósito (aparecen como "Sin plan"). Los totales del ticker del dashboard van a ser los de **esta** base (30 socios), no los números grandes del demo.

### 3.4 Crear la cuenta del equipo (primer usuario)

1. En el panel: **Authentication > Users > Add user**. Cargá tu email y una contraseña. Es tu usuario administrador.
2. Volvé al **SQL Editor** y dale permiso de staff (cambiá el email por el tuyo):

```sql
insert into public.staff (user_id, rol)
select id, 'admin' from auth.users where email = 'tu-email@tu-dominio.com';
```

3. Desactivá el registro público: en **Authentication**, dentro de la configuración de acceso (Sign In / Providers), buscá la opción **Allow new users to sign up** y apagala. Así solo entra quien vos cargues. (Los textos del panel cambian de vez en cuando; si no la encontrás, buscá "sign up" en la sección Authentication.)

### 3.5 Variables de entorno

Copiá el archivo de ejemplo y completalo:

```bash
cp .env.example .env.local
```

Abrí `.env.local` y pegá tus valores:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica
SUPABASE_SERVICE_ROLE_KEY=tu-clave-de-servidor
```

| Variable | Dónde va | Qué es |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend (navegador y servidor) | La dirección de tu proyecto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | La clave **pública** (en el panel aparece como `anon` o `publishable`). Es segura en el navegador **solo si todas las tablas tienen RLS** (ya lo hiciste en 3.2) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo servidor / tu compu** | La clave de administrador (en el panel: `service_role` o `secret`). **Se saltea toda la seguridad.** |

> **Regla de oro:** la `service_role` **jamás** lleva el prefijo `NEXT_PUBLIC_`, jamás se importa desde un componente `"use client"` y jamás se sube a GitHub. Todo lo que empieza con `NEXT_PUBLIC_` termina escrito dentro del JavaScript que descarga el navegador de cualquier visitante.

`.env.local` ya está ignorado por git (`.gitignore`). Verificalo:

```bash
git status
```

`.env.local` **no** tiene que aparecer en la lista.

### 3.6 Instalá las librerías

```bash
npm install @supabase/supabase-js @supabase/ssr
```

`@supabase/supabase-js` es el cliente. `@supabase/ssr` guarda la sesión en cookies para que funcione igual en el navegador y en el servidor de Next.js.

### 3.7 Creá el cliente de Supabase (`lib/supabase`)

Estos archivos son nuevos: creá la carpeta `lib/supabase/` en la raíz del proyecto.

`lib/supabase/client.ts`: el cliente para componentes del navegador (es el que van a usar los `api.ts`).

```ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

`lib/supabase/server.ts`: el cliente para Route Handlers y Server Components.

```ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Un Server Component no puede escribir cookies: el middleware ya refresca la sesión.
          }
        },
      },
    }
  )
}
```

`middleware.ts` (en la raíz, al lado de `package.json`): refresca la sesión en cada pedido y manda al `/login` a quien no esté logueado. En Next.js 15 el archivo se llama `middleware.ts`.

```ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // No pongas código entre createServerClient y getUser(): puede desloguear usuarios al azar.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
```

### 3.8 Login con Supabase Auth (reemplaza el auth stub)

**NUNCA Clerk:** la autenticación de este stack es Supabase Auth.

Hoy `shell/auth-stub.ts` devuelve siempre un usuario falso. Reemplazá **el contenido** de ese archivo, conservando el nombre y la forma del retorno (`{ user: { id, name } }`):

```ts
import { createClient } from "@/lib/supabase/server"

export async function getSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  return { user: { id: user.id, name: user.email ?? "Usuario" } }
}
```

Creá la pantalla de ingreso en `app/login/page.tsx`:

```tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email o contraseña incorrectos")
      return
    }
    router.replace("/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={entrar} className="surface-card mx-auto mt-16 max-w-sm space-y-4 p-6">
      <h1 className="font-heading text-xl font-bold uppercase">Ingresar</h1>
      <label className="block text-sm">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-muted bg-surface px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Contraseña
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-muted bg-surface px-3 py-2"
        />
      </label>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button type="submit" className="w-full rounded bg-primary px-4 py-2 font-medium text-fg">
        Entrar
      </button>
    </form>
  )
}
```

Para cerrar sesión, en cualquier botón: `await createClient().auth.signOut(); router.replace("/login")`.

> En **Authentication > URL Configuration** cargá la URL de tu sitio publicado (la de Vercel, sección 5) como *Site URL*; la vas a necesitar para links de recuperación de contraseña.

### 3.9 Cambiá el cuerpo de las funciones (firma idéntica)

Primero un archivo de ayuda con el formato que hoy devuelve el mock (`"hace 8d"`, `"02 jul"`, `"17:24"`). Creá `lib/formato.ts`:

```ts
// Misma zona que club_config.zona_horaria
const ZONA = "America/Argentina/Buenos_Aires"

export const hoyClub = () => new Date().toLocaleDateString("en-CA", { timeZone: ZONA }) // "2026-10-10"

const hora = (d: Date) =>
  d.toLocaleTimeString("en-GB", { timeZone: ZONA, hour: "2-digit", minute: "2-digit" })

export const horaClub = () => hora(new Date()) // "18:12"

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

// "2026-07-02" -> "02 jul"
export function diaMes(fecha: string | null): string {
  if (!fecha) return "-"
  const [, m, d] = fecha.split("-")
  return `${d} ${MESES[Number(m) - 1]}`
}

// timestamp -> "hoy" | "ayer" | "hace 8d"
export function haceDias(iso: string | null): string {
  if (!iso) return "nunca"
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  return dias <= 0 ? "hoy" : dias === 1 ? "ayer" : `hace ${dias}d`
}

// timestamp -> "17:24" si es de hoy, "08 oct" si es de otro día
export function horaHilo(iso: string): string {
  const d = new Date(iso)
  const dia = d.toLocaleDateString("en-CA", { timeZone: ZONA })
  return dia === hoyClub() ? hora(d) : diaMes(dia)
}
```

#### Ejemplo completo: `getClasesHoy` (módulo Clases)

**ANTES** (`modules/agenda/api.ts`, el demo):

```ts
import raw from "./data.json"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getClasesHoy(): Promise<ClaseAgenda[]> {
  await sleep(300)
  return structuredClone(raw.clases) as ClaseAgenda[]
}
```

**DESPUÉS** (conectado a Supabase; la firma es la misma: sin parámetros, devuelve `Promise<ClaseAgenda[]>`):

```ts
import { createClient } from "@/lib/supabase/client"
import { hoyClub } from "@/lib/formato"

export async function getClasesHoy(): Promise<ClaseAgenda[]> {
  const { data, error } = await createClient()
    .from("clases_vista")
    .select("id, hora, fin, clase, coach, sala, ocupados, cupo, waitlist, estado")
    .eq("fecha", hoyClub())
    .order("hora")

  if (error) throw new Error(`getClasesHoy: ${error.message}`)
  return data as ClaseAgenda[]
}
```

Qué cambió: desaparecen `import raw`, `sleep` y `structuredClone`; los **tipos** (`ClaseAgenda`, `EstadoClase`) quedan intactos. Como la vista ya devuelve las columnas con los mismos nombres y tipos, no hay que transformar nada.

Un detalle: el componente hoy hace `getClasesHoy().then(setClases)` sin manejar errores. En tu copia agregale un `.catch(...)` (por ejemplo, guardar un mensaje de error en el estado y mostrarlo) para que una falla de red no deje la pantalla en blanco.

#### Las demás funciones

Mismo patrón: importás `createClient`, consultás la vista, si hay `error` lo lanzás, y devolvés el mismo tipo.

```ts
// modules/ventas/api.ts
export async function getMembresias(): Promise<Ticket[]> {
  const { data, error } = await createClient()
    .from("membresias_vista")
    .select("id, socio, plan, monto, dias, estado, cobro")
    .order("dias")
  if (error) throw new Error(`getMembresias: ${error.message}`)
  return data as Ticket[]
}
```

```ts
// modules/contactos/api.ts
import { diaMes, haceDias } from "@/lib/formato"

export async function getSocios(): Promise<Socio[]> {
  const { data, error } = await createClient().from("socios_vista").select("*").order("nombre")
  if (error) throw new Error(`getSocios: ${error.message}`)
  return data.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    documento: r.documento,
    plan: r.plan,
    estado: r.estado,
    ultimoCheckin: haceDias(r.ultimo_checkin),
    vencimiento: diaMes(r.vencimiento),
    email: r.email ?? "",
    telefono: r.telefono ?? "",
  }))
}
```

```ts
// modules/conversaciones/api.ts
import { horaHilo } from "@/lib/formato"

export async function getThreads(): Promise<Thread[]> {
  const { data, error } = await createClient()
    .from("hilos_vista")
    .select("id, name, last, ultimo_mensaje_en, unread")
    .order("ultimo_mensaje_en", { ascending: false })
  if (error) throw new Error(`getThreads: ${error.message}`)
  return data.map((r) => ({ id: r.id, name: r.name, last: r.last, time: horaHilo(r.ultimo_mensaje_en), unread: r.unread }))
}

export async function getMessages(threadId: string): Promise<Message[]> {
  const { data, error } = await createClient()
    .from("mensajes")
    .select("id, de, texto, creado_en")
    .eq("conversacion_id", threadId)
    .order("creado_en")
  if (error) throw new Error(`getMessages: ${error.message}`)
  return data.map((m) => ({ id: m.id, from: m.de, text: m.texto, time: horaHilo(m.creado_en) }))
}
```

```ts
// modules/dashboard/api.ts
import { horaClub, hoyClub } from "@/lib/formato"

export async function getAforoClub(): Promise<AforoClub> {
  const { data, error } = await createClient()
    .from("aforo_club")
    .select("ocupados, cupo, ayer_misma_hora")
    .single()
  if (error) throw new Error(`getAforoClub: ${error.message}`)
  const delta =
    data.ayer_misma_hora > 0 ? Math.round(((data.ocupados - data.ayer_misma_hora) / data.ayer_misma_hora) * 100) : 0
  return { ocupados: data.ocupados, cupo: data.cupo, delta }
}

// Las clases del bloque actual: las que todavía no terminaron hoy
export async function getTermometro(): Promise<ClaseCupo[]> {
  const { data, error } = await createClient()
    .from("clases_vista")
    .select("id, clase, coach, hora, sala, ocupados, cupo, waitlist")
    .eq("fecha", hoyClub())
    .neq("estado", "cancelada")
    .gte("fin", horaClub())
    .order("hora")
    .limit(7)
  if (error) throw new Error(`getTermometro: ${error.message}`)
  return data as ClaseCupo[]
}

export async function getCurvaCheckins(): Promise<CheckinHora[]> {
  const { data, error } = await createClient()
    .from("curva_checkins_hoy")
    .select("hora, checkins, ahora")
    .order("hora")
  if (error) throw new Error(`getCurvaCheckins: ${error.message}`)
  return data as CheckinHora[]
}

export async function getTicker(): Promise<TickerItem[]> {
  const { data: k, error } = await createClient().from("ticker_kpis").select("*").single()
  if (error) throw new Error(`getTicker: ${error.message}`)
  const n = (x: number) => x.toLocaleString("es-AR")
  return [
    { id: "1", label: "Check-ins hoy", valor: n(k.checkins_hoy), tono: "accent" },
    { id: "2", label: "Socios activos", valor: n(k.socios_activos), tono: "fg" },
    { id: "3", label: "Clases hoy", valor: n(k.clases_hoy), tono: "info" },
    { id: "4", label: "No-shows", valor: n(k.no_shows), tono: "warning" },
    { id: "5", label: "Waitlist total", valor: n(k.waitlist_total), tono: "info" },
    { id: "6", label: "MRR", valor: `$ ${n(k.mrr)}`, tono: "success" },
    { id: "7", label: "Débitos rechazados", valor: n(k.debitos_rechazados), tono: "danger" },
    { id: "8", label: "Ocupación media", valor: `${k.ocupacion_media}%`, tono: "accent" },
  ]
}
```

Dos avisos honestos sobre el dashboard:

- Hoy el dashboard **simula** movimiento (cada 3,5 segundos suma una persona a una clase). Con datos reales ese movimiento tiene que venir de la base: o volvés a consultar cada tanto, o usás las suscripciones en tiempo real de Supabase (Realtime) sobre `checkins` y `reservas`. Es una mejora aparte; la primera versión puede refrescar con un `setInterval` que vuelva a llamar a las funciones.
- Cuando los datos son reales, la acción "reservar" desde la UI debe llamar a `reservar_clase` (no a un `insert` directo en `reservas`), así se respeta el cupo.

Para tener tipos generados desde tu base (opcional): `npx supabase gen types typescript --project-id tu-proyecto > lib/database.types.ts` (necesita `npx supabase login` antes).

### 3.10 Probalo

1. `npm run dev` y abrí http://localhost:3000: tenés que caer en `/login`.
2. Entrá con el usuario que creaste en 3.4.
3. Dashboard, Clases, Membresías, Socios y Conversaciones tienen que mostrar los datos de tu base.
4. Si una lista aparece **vacía y sin error**, casi seguro es RLS: tu usuario no está en `staff` (ver sección 8).

---

## 4. Railway: tareas que corren solas (pg-boss)

### 4.1 Para qué sirve, en criollo

Tu web (Vercel) responde cuando alguien entra. Pero hay trabajo que **nadie pide con un clic** y tiene que pasar igual, a las 9 de la mañana o cada noche: avisar a un socio que su cuota vence, marcar como vencidas las membresías que se pasaron, reactivar a los que dejaron de venir. Para eso necesitás un programa que esté prendido todo el tiempo: un **worker**. Eso va en Railway.

**pg-boss** es la librería que le da al worker una "cola de tareas" y un reloj (cron), usando **la misma base de Supabase** (guarda sus tablas en un esquema aparte llamado `pgboss`). No necesitás Redis ni nada extra.

Casos de este nicho:

| Tarea | Cuándo | Qué hace |
|-------|--------|----------|
| Actualizar estados de membresías | Todas las noches | Pasa a `por-vencer` las que vencen en los próximos 7 días y a `vencido` las que ya se pasaron |
| Aviso de vencimiento | Todas las mañanas | Avisa por WhatsApp o email a quienes vencen en 7 días y en 1 día |
| Recordatorio de clase | Cada pocos minutos | Avisa 2 horas antes y libera el cupo de quien no hizo check-in (lo anticipa `modules/agenda/BACKEND.md`) |
| Cobro recurrente y reintentos | Todos los días | Débito automático de la cuota y reintento de los rechazados (`modules/ventas/BACKEND.md`) |
| Reactivación de socios | Semanal | Escribe a quien no registra un check-in hace 14 días |
| Reintento de mensajes | Cuando falla un envío | Vuelve a intentar el envío (`modules/conversaciones/BACKEND.md`) |

### 4.2 Qué conexión usar (importante)

Supabase te ofrece tres formas de conectarte a Postgres. Para un worker que queda prendido siempre:

| Conexión | Puerto | ¿Para pg-boss? |
|----------|--------|----------------|
| **Session pooler** | 5432 | **Sí. Es la recomendada.** Funciona por IPv4 y mantiene la sesión que pg-boss necesita |
| Conexión directa | 5432 | Sí, pero en el plan gratis solo habla IPv6; desde Railway tendrías que activar *Outbound IPv6* en el servicio (es opcional por servicio) |
| Transaction pooler | 6543 | **No.** Corta la sesión entre consultas y pg-boss usa `LISTEN/NOTIFY` y bloqueos de sesión |

En el panel de Supabase abrí **Connect**, elegí **Session pooler** y copiá la cadena. Se ve así (con tus datos en lugar de los placeholders):

```text
postgresql://postgres.tu-proyecto:[TU-CONTRASEÑA]@aws-0-tu-region.pooler.supabase.com:5432/postgres
```

### 4.3 Creá el worker (en un repo aparte)

El worker **no va dentro de este repo**: es otro proyecto chico. Creá una carpeta nueva (por ejemplo `forja-worker`), con su propio repo en GitHub, y adentro:

```bash
mkdir forja-worker && cd forja-worker
npm init -y
npm install pg-boss @supabase/supabase-js
```

En su `package.json` agregá estas líneas (pg-boss pide **Node 22.12 o mayor**):

```json
{
  "type": "module",
  "scripts": { "start": "node worker.mjs" },
  "engines": { "node": ">=22.12.0" }
}
```

Y guardá este esqueleto como `worker.mjs`. Es un **ejemplo para adaptar**, no un código terminado: el envío real del mensaje (`enviarAviso`) lo tenés que conectar a tu proveedor de WhatsApp o email.

```js
import { PgBoss } from "pg-boss"
import { createClient } from "@supabase/supabase-js"

// Estas 3 variables las cargás en Railway (4.5). Nunca van en el código.
const { DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
if (!DATABASE_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Faltan variables de entorno")
}

const ZONA = "America/Argentina/Buenos_Aires"
const hoy = () => new Date().toLocaleDateString("en-CA", { timeZone: ZONA })
const sumarDias = (iso, n) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// Con service_role el worker se saltea el RLS: trabaja como administrador.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const boss = new PgBoss({ connectionString: DATABASE_URL, max: 5 })
boss.on("error", (e) => console.error("pg-boss:", e))
await boss.start()

// 1) Colas (hay que crearlas antes de usarlas o de programarlas)
await boss.createQueue("actualizar-estados")
await boss.createQueue("avisos-vencimiento")
await boss.createQueue("enviar-aviso")

// 2) Qué hace cada cola
await boss.work("actualizar-estados", async () => {
  const h = hoy()
  const venc = await supabase
    .from("membresias")
    .update({ estado: "vencido" })
    .lt("vencimiento", h)
    .in("estado", ["activo", "por-vencer"])
  if (venc.error) throw new Error(venc.error.message) // si tira error, pg-boss reintenta
  const porVencer = await supabase
    .from("membresias")
    .update({ estado: "por-vencer" })
    .gte("vencimiento", h)
    .lte("vencimiento", sumarDias(h, 7))
    .eq("estado", "activo")
  if (porVencer.error) throw new Error(porVencer.error.message)
})

await boss.work("avisos-vencimiento", async () => {
  // La vista trae "dias": cuántos faltan para vencer
  const { data, error } = await supabase
    .from("membresias_vista")
    .select("id, socio, plan, dias")
    .in("dias", [7, 1])
    .in("estado", ["activo", "por-vencer"])
  if (error) throw new Error(error.message)
  for (const m of data) await boss.send("enviar-aviso", m) // una tarea por socio
})

await boss.work("enviar-aviso", async ([job]) => {
  const { socio, plan, dias } = job.data
  // TODO: acá va tu proveedor de WhatsApp o email.
  console.log(`Aviso a ${socio}: tu plan ${plan} vence en ${dias} día(s)`)
})

// 3) Horarios (cron). "tz" hace que 09:00 sea 09:00 en Buenos Aires.
await boss.schedule("actualizar-estados", "0 3 * * *", {}, { tz: ZONA })
await boss.schedule("avisos-vencimiento", "0 9 * * *", {}, { tz: ZONA })

// 4) Apagado limpio cuando Railway reinicia el servicio
process.on("SIGTERM", async () => {
  await boss.stop()
  process.exit(0)
})
```

Probalo en tu compu antes de subirlo (con `DATABASE_URL`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` cargadas en tu terminal o en un `.env` **ignorado por git**):

```bash
node --env-file=.env worker.mjs
```

La primera vez, pg-boss crea su esquema `pgboss` en tu base. Es normal.

### 4.4 Creá el proyecto en Railway

1. Entrá a https://railway.com y creá tu cuenta.
2. **New Project > Deploy from GitHub repo** y elegí el repo del worker.
3. Entrá al servicio creado, abrí **Settings** y en **Deploy** poné el **Custom Start Command**: `node worker.mjs`.
4. No hace falta que le generes un dominio público: es un worker, no recibe visitas.

### 4.5 Variables en Railway

En el servicio, pestaña **Variables**, cargá:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | La cadena del **Session pooler** de 4.2 |
| `SUPABASE_URL` | `https://tu-proyecto.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | La clave `service_role` (acá sí va: es un servidor privado) |

Al guardar, Railway te propone redeployar. Aceptá.

### 4.6 Verificá que anda

- En la pestaña **Deployments** abrí los logs: no tiene que haber errores de conexión.
- En el **Table Editor** de Supabase cambiá el esquema a `pgboss`: tienen que aparecer las tablas que creó la librería (colas, trabajos y horarios).
- Para probar sin esperar al horario, bajá temporalmente el cron a "cada minuto" (`* * * * *`), mirá los logs y volvelo a dejar como estaba.
- Si el deploy falla por la versión de Node, mirá en los logs qué versión usó el build. pg-boss necesita 22.12 o mayor; consultá en la documentación de Railway cómo fijar la versión de Node (el campo `engines` de `package.json` es el punto de partida).

---

## 5. Vercel: publicar la web

1. Subí **tu copia** del proyecto a tu GitHub (fork o repo propio).
2. Entrá a https://vercel.com, creá tu cuenta con GitHub y hacé **Add New > Project**.
3. Elegí tu repo en **Import Git Repository**. Vercel detecta solo que es **Next.js**: no cambies el *Framework Preset* ni los comandos.
4. Antes de apretar Deploy, abrí **Environment Variables** y cargá las que usa la web (las del frontend, **no** las de Railway):

   | Variable | Para qué | ¿Cuándo? |
   |----------|----------|----------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Conectar a Supabase | Ya |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Idem | Ya |
   | `OPENAI_API_KEY` y `OPENAI_MODEL` (o `GEMINI_API_KEY` y `GEMINI_MODEL`) | IA | Cuando llegues a la sección 6 |

   Al cargar cada una elegí en qué entornos aplica: **Production**, **Preview** (las ramas y pull requests) y **Development**. Para empezar marcá las tres.
   **No cargues `SUPABASE_SERVICE_ROLE_KEY` en Vercel** salvo que escribas código de servidor que realmente la necesite (este sistema no la necesita en la web).
5. Apretá **Deploy**. En un par de minutos tenés una URL tipo `tu-proyecto.vercel.app`.
6. **Dominio propio:** en el proyecto, **Settings > Domains > Add**, escribí tu dominio y creá en tu proveedor de dominios los registros DNS que Vercel te muestra. Cuando valide, queda con HTTPS.
7. **Redeploy automático:** cada `git push` a la rama de producción (normalmente `main`) publica solo; cada rama o pull request genera una URL de *preview* para probar antes.
8. Volvé a Supabase (**Authentication > URL Configuration**) y cargá tu URL final como *Site URL*.

Dos cosas para recordar:

- Las variables `NEXT_PUBLIC_*` se **incrustan al construir** la web. Si cambiás una, tenés que **redeployar** (en **Deployments**, el menú del último deploy > Redeploy).
- Si el build falla: abrí el deploy fallido, leé el log de **Build** (el error real está en las últimas líneas), y reproducilo en tu compu con `npm run build`. Casi siempre es un error de TypeScript, un archivo importado con mayúsculas distintas (Linux distingue `Api.ts` de `api.ts`) o una dependencia que falta en `package.json`.

---

## 6. IA (OpenAI o Gemini) en este sistema

Este sistema no trae módulos de agente de IA ni de llamadas: el lugar natural para la IA es **Conversaciones**, donde llegan las consultas de los socios ("¿queda lugar en el Spinning de las 18?", "¿cómo congelo la membresía?").

Ideas concretas para este nicho (de menor a mayor riesgo):

1. **Sugerir una respuesta** a la última consulta, que la recepcionista revisa y envía. La IA **no envía sola**.
2. **Clasificar** cada consulta (horarios, congelar, baja, reserva, precio) para ordenar el inbox.
3. **Resumir** un hilo largo.
4. **Redactar** el texto de reactivación para quien dejó de venir.

### 6.1 La regla que no se negocia: la clave solo en el servidor

La API key **nunca** se usa desde un componente del navegador ni lleva `NEXT_PUBLIC_`. Se usa en un **Route Handler** (`app/api/.../route.ts`) que corre en el servidor. El navegador solo le pregunta a *tu* endpoint.

Variables (en `.env.local` y en Vercel; ya están en `.env.example`):

```bash
OPENAI_API_KEY=tu-clave
OPENAI_MODEL=nombre-del-modelo
```

El nombre del modelo cambia seguido: sacalo de la documentación del proveedor cuando lo configures, y dejalo en la variable para poder cambiarlo sin tocar código.

### 6.2 Ejemplo mínimo: sugerir respuesta

```bash
npm install openai
```

Archivo `app/api/sugerir-respuesta/route.ts`:

```ts
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"
import { hoyClub } from "@/lib/formato"

export async function POST(req: Request) {
  // 1) Solo usuarios logueados (si no, cualquiera gastaría tu crédito)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  // 2) Validar la entrada
  const { conversacionId } = await req.json()
  if (typeof conversacionId !== "string") {
    return NextResponse.json({ error: "Falta conversacionId" }, { status: 400 })
  }

  // 3) Últimos mensajes del hilo y clases de hoy (para no inventar disponibilidad)
  const { data: mensajes, error } = await supabase
    .from("mensajes")
    .select("de, texto")
    .eq("conversacion_id", conversacionId)
    .order("creado_en", { ascending: false })
    .limit(10)
  if (error) return NextResponse.json({ error: "No se pudo leer la conversación" }, { status: 500 })

  const { data: clases } = await supabase
    .from("clases_vista")
    .select("hora, clase, ocupados, cupo, waitlist, estado")
    .eq("fecha", hoyClub())
    .order("hora")

  const historial = mensajes
    .reverse()
    .map((m) => `${m.de === "socio" ? "Socio" : "Recepcion"}: ${m.texto}`)
    .join("\n")

  // 4) Llamar al modelo (la clave sale de process.env, solo en el servidor)
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const respuesta = await openai.responses.create({
    model: process.env.OPENAI_MODEL!,
    instructions:
      "Sos recepcionista de un gimnasio. Respondé en español rioplatense, breve y amable. " +
      "Usá SOLO estos datos de clases de hoy para hablar de cupos; si no está, decí que lo vas a confirmar. " +
      JSON.stringify(clases ?? []),
    input: historial,
    max_output_tokens: 200,
  })

  return NextResponse.json({ sugerencia: respuesta.output_text })
}
```

Con Gemini el cambio es chico (`npm install @google/genai`):

```ts
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const respuesta = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL!,
  contents: historial,
  config: { systemInstruction: "Sos recepcionista de un gimnasio..." },
})
const sugerencia = respuesta.text
```

Desde el módulo de Conversaciones, el botón "sugerir respuesta" hace un `fetch("/api/sugerir-respuesta", { method: "POST", body: JSON.stringify({ conversacionId }) })` y pone el texto en el campo de mensaje **para que la persona lo revise**.

### 6.3 Costos y límites que tenés que vigilar

- **Se cobra por uso** (por cantidad de texto que entra y sale). Cada hilo largo cuesta más que uno corto: por eso el código toma solo los últimos 10 mensajes y limita la salida con `max_output_tokens`.
- **Poné un tope de gasto** en el panel del proveedor (límite mensual o alerta de presupuesto) antes de publicar.
- **Limitá las llamadas por usuario**: un contador diario (por ejemplo una tabla `ia_uso` con usuario, fecha y cantidad) o un servicio de rate limiting. Sin eso, un bucle o un usuario enojado vacía tu crédito.
- **Respetá los límites del proveedor** (peticiones por minuto): manejá el error 429 con un mensaje claro y no reintentes en loop.
- **Datos personales:** mandá al modelo solo lo necesario (nada de documentos ni teléfonos si no hacen falta) y revisá la política de datos del proveedor y la normativa de protección de datos personales de tu país.
- **Nunca confíes en la salida a ciegas:** que un humano apruebe antes de enviar, sobre todo con cupos y precios.

---

## 7. Checklist de seguridad antes de cargar datos reales

Marcá cada punto. Si uno falla, no cargues datos reales todavía.

- [ ] **RLS prendido en todas las tablas** y ninguna política tiene `using (true)` para `anon`. Revisalo en Table Editor (candado) y con los Advisors de seguridad del panel.
- [ ] **Solo entra el staff:** el registro público de Supabase Auth está apagado y cada persona del equipo está cargada en `staff` con su rol.
- [ ] **La `service_role` está fuera del frontend:** no aparece en el código del navegador ni con prefijo `NEXT_PUBLIC_`. Buscala: `grep -rn "service_role\|SERVICE_ROLE" app modules shell lib`. Solo debe estar en `scripts/seed.mjs`, en el worker y en las variables de Railway.
- [ ] **Ningún `.env` en git:** `git status` no lista `.env.local`; `.gitignore` ignora `.env*` pero deja pasar `.env.example`. Revisá además el historial: `git log --all --oneline -- .env.local` no tiene que devolver nada. Si alguna vez subiste una clave, **rotala** en el panel (cambiarla, no borrar el commit).
- [ ] **Repo privado si hay datos reales.** Nunca subas datos reales de socios (nombres, documentos, teléfonos, emails) a un repositorio público, ni en un `data.json` ni en un seed.
- [ ] **Rate limiting** en los endpoints que cuestan plata (IA) y en el login. Supabase Auth tiene límites de pedidos configurables: revisalos en el panel y sumá los tuyos en `/api/*`.
- [ ] **Backups:** activá y probá la restauración de backups de Supabase (revisá qué incluye tu plan) y guardá una copia periódica propia.
- [ ] **Variables separadas por entorno:** idealmente un proyecto de Supabase para pruebas (el del seed) y otro para producción.
- [ ] **Contraseñas fuertes y 2FA** en Supabase, GitHub, Vercel y Railway.
- [ ] **Datos mínimos:** no guardes lo que no necesitás (por ejemplo, datos de tarjeta: eso lo maneja el medio de pago, no tu base).
- [ ] **El worker no loguea datos personales** (revisá los `console.log` antes de producción).

---

## 8. Errores comunes y cómo resolverlos

| Qué ves | Causa probable | Solución |
|---------|----------------|----------|
| Las listas aparecen **vacías y sin error** | RLS está filtrando: tu usuario no está en `staff` (o no estás logueado) | Corré el `insert into public.staff ...` de 3.4 con tu email y recargá |
| `new row violates row-level security policy for table ...` | Intentás escribir sin ser staff, o sin sesión | Mismo caso: sumate a `staff` y verificá que el login funcione |
| `permission denied for table ...` | Faltan los permisos de tabla (`grant`) | Corré de nuevo las dos últimas líneas del SQL de 3.2 (`grant ... to authenticated`) |
| `relation "public.xxx" does not exist` | El SQL de 3.2 se cortó a la mitad | Corrélo de nuevo por secciones; si ya existen tablas, borralas desde el SQL Editor y empezá limpio |
| `Invalid API key` o `Invalid URL` | `.env.local` mal completado, o no reiniciaste `npm run dev` | Revisá las 3 variables, guardá y reiniciá el servidor |
| `process.env.NEXT_PUBLIC_...` es `undefined` en el navegador | Falta el prefijo `NEXT_PUBLIC_` o no redeployaste en Vercel | Corregí el nombre y redeployá |
| El login "rebota" y vuelve a `/login` | La sesión no se guarda: falta el `middleware.ts` o está mal el `matcher` | Revisá que `middleware.ts` esté en la raíz y que `getUser()` se llame antes de devolver la respuesta |
| `Email not confirmed` al ingresar | El usuario se creó sin confirmar su email | En **Authentication > Users** confirmá al usuario (o créalo ya confirmado) |
| El build de Vercel falla con `Type error` | TypeScript más estricto en el build que en `dev` | Corré `npx tsc --noEmit` y `npm run build` en tu compu y arreglá lo que marque |
| `Module not found` en Vercel pero anda en tu compu | Mayúsculas distintas en un import o dependencia sin instalar | Igualá el nombre del archivo y corré `npm install nombre-del-paquete` para que quede en `package.json` |
| Railway: `ENOTFOUND` / `ENETUNREACH` / no conecta | Usaste la conexión directa (IPv6) | Usá la cadena del **Session pooler** o activá *Outbound IPv6* en el servicio |
| pg-boss: error con la cola o el cron | Programaste (`schedule`) o trabajaste (`work`) una cola que no creaste | Agregá `await boss.createQueue("nombre")` antes |
| pg-boss falla al arrancar por la versión de Node | pg-boss pide Node 22.12 o mayor | Fijá la versión de Node del servicio (ver 4.6) |
| La IA responde `401` | Clave mal copiada o sin crédito | Revisá `OPENAI_API_KEY` / `GEMINI_API_KEY` y la facturación del proveedor |
| La IA responde `429` | Demasiadas peticiones o tope de gasto alcanzado | Esperá, bajá la frecuencia y revisá tus límites en el panel |

---

## 9. Siguiente paso

Con esto tenés la base de un sistema real para un gimnasio. Lo que viene después (cobros automáticos, WhatsApp oficial, app para los socios, reportes) es justo lo que se trabaja con acompañamiento.

**Aprendé a crear tu Agencia de IA y conseguir tu primer cliente.** Eso lo trabajamos adentro del Club de la IA, nuestro Skool privado.

Entrá al Club de la IA: https://www.skool.com/club-de-la-ia-8047/about
