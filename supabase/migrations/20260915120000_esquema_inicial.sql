-- ============================================================================
--  Segundo corte · Introducción a la Ingeniería Informática (Unimayor)
--  Esquema inicial: perfiles, grupos, catálogo de actividades, intentos,
--  mejores resultados, borradores y logros.
--
--  Principios aplicados:
--   * RLS activo en todas las tablas con datos de estudiantes.
--   * El estudiante no puede asignarse el rol docente (trigger, no solo RLS).
--   * El puntaje NO lo envía el navegador: lo recalcula registrar_intento()
--     a partir de puntos_max del catálogo, las pistas y los intentos fallidos.
--   * Idempotencia por cliente_id: doble clic o reintento de red no duplica.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tipos
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.rol_usuario as enum ('estudiante', 'docente', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.estado_actividad as enum ('intentada', 'completada', 'dominada');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. Grupos
-- ---------------------------------------------------------------------------

create table if not exists public.grupos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  periodo     text not null default '2026-1',
  activo      boolean not null default true,
  creado_en   timestamptz not null default now()
);

comment on table public.grupos is
  'Grupos del curso. La lista de nombres es pública para que el formulario de registro pueda mostrarla.';

-- ---------------------------------------------------------------------------
-- 3. Perfiles (1 a 1 con auth.users)
-- ---------------------------------------------------------------------------

create table if not exists public.perfiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  nombres             text not null,
  apellidos           text not null,
  correo              text,
  codigo_estudiantil  text,
  grupo_id            uuid references public.grupos(id) on delete set null,
  rol                 public.rol_usuario not null default 'estudiante',
  alias               text,
  ranking_publico     boolean not null default false,
  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now()
);

comment on column public.perfiles.codigo_estudiantil is
  'Dato administrativo opcional. NO es credencial: no sirve por sí solo para iniciar sesión.';
comment on column public.perfiles.ranking_publico is
  'Si el estudiante acepta aparecer en la clasificación opcional, siempre bajo alias.';

create index if not exists perfiles_grupo_idx on public.perfiles (grupo_id);

-- Docentes autorizados por grupo. Un docente solo consulta los grupos que tiene aquí.
create table if not exists public.docente_grupos (
  docente_id  uuid not null references public.perfiles(id) on delete cascade,
  grupo_id    uuid not null references public.grupos(id) on delete cascade,
  primary key (docente_id, grupo_id)
);

-- ---------------------------------------------------------------------------
-- 4. Catálogo de estaciones y actividades (identificadores estables)
-- ---------------------------------------------------------------------------

create table if not exists public.estaciones (
  id        text primary key,
  orden     integer not null,
  titulo    text not null,
  sesion    text not null
);

create table if not exists public.actividades (
  id            text primary key,
  estacion_id   text not null references public.estaciones(id) on delete cascade,
  titulo        text not null,
  tipo          text not null,
  nivel         text not null default 'base',       -- 'base' | 'opcional'
  puntos_max    integer not null check (puntos_max >= 0),
  cuenta_nota   boolean not null default true,      -- entra en la nota orientativa
  conceptos     text[] not null default '{}',
  orden         integer not null default 0
);

comment on column public.actividades.cuenta_nota is
  'false para retos opcionales y repaso sin nota. La nota orientativa los excluye.';

create index if not exists actividades_estacion_idx on public.actividades (estacion_id);

-- ---------------------------------------------------------------------------
-- 5. Intentos, mejores resultados y borradores
-- ---------------------------------------------------------------------------

create table if not exists public.intentos (
  id                uuid primary key default gen_random_uuid(),
  perfil_id         uuid not null references public.perfiles(id) on delete cascade,
  actividad_id      text not null references public.actividades(id) on delete cascade,
  correcto          boolean not null,
  puntaje           integer not null default 0,
  pistas_usadas     integer not null default 0,
  solucion_vista    boolean not null default false,
  intentos_fallidos integer not null default 0,
  datos             jsonb not null default '{}'::jsonb,
  cliente_id        text not null,
  creado_en         timestamptz not null default now()
);

-- Idempotencia: el mismo envío (doble clic, reintento de red) se guarda una vez.
create unique index if not exists intentos_idempotencia
  on public.intentos (perfil_id, cliente_id);

create index if not exists intentos_perfil_actividad_idx
  on public.intentos (perfil_id, actividad_id, creado_en desc);

create table if not exists public.mejores (
  perfil_id          uuid not null references public.perfiles(id) on delete cascade,
  actividad_id       text not null references public.actividades(id) on delete cascade,
  mejor_puntaje      integer not null default 0,
  estado             public.estado_actividad not null default 'intentada',
  pistas_minimas     integer not null default 0,
  intentos_totales   integer not null default 0,
  primera_vez        timestamptz not null default now(),
  actualizado_en     timestamptz not null default now(),
  primary key (perfil_id, actividad_id)
);

create index if not exists mejores_actividad_idx on public.mejores (actividad_id);

create table if not exists public.borradores (
  perfil_id      uuid not null references public.perfiles(id) on delete cascade,
  actividad_id   text not null references public.actividades(id) on delete cascade,
  contenido      jsonb not null,
  actualizado_en timestamptz not null default now(),
  primary key (perfil_id, actividad_id)
);

comment on table public.borradores is
  'Trabajo a medio hacer que conviene recuperar: código del laboratorio, respuestas de un taller, '
  'estado de un reto largo. No otorga puntaje.';

-- ---------------------------------------------------------------------------
-- 6. Logros
-- ---------------------------------------------------------------------------

create table if not exists public.logros (
  id           text primary key,
  titulo       text not null,
  descripcion  text not null,
  evidencia    text not null      -- qué hay que demostrar, en texto legible
);

create table if not exists public.logros_obtenidos (
  perfil_id  uuid not null references public.perfiles(id) on delete cascade,
  logro_id   text not null references public.logros(id) on delete cascade,
  obtenido_en timestamptz not null default now(),
  primary key (perfil_id, logro_id)
);

-- ---------------------------------------------------------------------------
-- 7. Funciones auxiliares (SECURITY DEFINER para no recursar sobre RLS)
-- ---------------------------------------------------------------------------

create or replace function public.mi_rol()
returns public.rol_usuario
language sql
stable
security definer
set search_path = public
as $$
  select rol from public.perfiles where id = auth.uid();
$$;

create or replace function public.mi_grupo()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select grupo_id from public.perfiles where id = auth.uid();
$$;

-- ¿El usuario actual es docente autorizado del grupo indicado?
create or replace function public.docente_ve_grupo(p_grupo uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.docente_grupos dg
      join public.perfiles p on p.id = dg.docente_id
     where dg.docente_id = auth.uid()
       and dg.grupo_id   = p_grupo
       and p.rol in ('docente', 'admin')
  );
$$;

-- ¿El usuario actual puede ver los datos de este estudiante?
create or replace function public.puede_ver_perfil(p_perfil uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_perfil = auth.uid()
      or exists (
        select 1
          from public.perfiles e
         where e.id = p_perfil
           and e.grupo_id is not null
           and public.docente_ve_grupo(e.grupo_id)
      );
$$;

-- ---------------------------------------------------------------------------
-- 8. Alta de usuario: crea el perfil a partir de los metadatos del registro
-- ---------------------------------------------------------------------------

create or replace function public.manejar_usuario_nuevo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_grupo uuid;
begin
  -- El grupo llega como nombre; se resuelve contra la tabla. Nunca se crea aquí.
  select g.id into v_grupo
    from public.grupos g
   where g.nombre = nullif(new.raw_user_meta_data ->> 'grupo', '')
   limit 1;

  insert into public.perfiles (id, nombres, apellidos, correo, codigo_estudiantil, grupo_id, rol)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nombres'), ''), 'Sin nombre'),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'apellidos'), ''), ''),
    new.email,
    nullif(trim(new.raw_user_meta_data ->> 'codigo_estudiantil'), ''),
    v_grupo,
    'estudiante'            -- el rol NUNCA se toma de los metadatos del cliente
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.manejar_usuario_nuevo();

-- ---------------------------------------------------------------------------
-- 9. Blindaje del rol: un estudiante no puede ascenderse a docente
-- ---------------------------------------------------------------------------

-- ¿La conexión actual es administrativa (service_role o SQL Editor)?
--
-- CUIDADO: esta función NO puede llamarse desde un contexto SECURITY DEFINER.
-- Dentro de un definer, current_user es el dueño de la función (postgres), así
-- que cualquier estudiante parecería administrador. Por eso proteger_rol() es
-- SECURITY INVOKER: necesita ver el rol real de quien ejecuta la sentencia.
--
-- Roles que llegan aquí:
--   'authenticated' / 'anon'  → un usuario de la aplicación: nunca administra.
--   'service_role'            → la clave secreta del proyecto.
--   'postgres'/'supabase_admin' → el SQL Editor de la consola de Supabase.
create or replace function public.es_administrativa()
returns boolean
language plpgsql
stable
as $$
declare
  v_rol text;
begin
  if current_user in ('anon', 'authenticated') then
    return false;
  end if;

  v_rol := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif(current_setting('request.jwt.claims', true)::json ->> 'role', ''),
    ''
  );
  return v_rol = 'service_role'
      or current_user in ('postgres', 'supabase_admin', 'service_role');
exception when others then
  -- Si el claim no es JSON válido, se decide solo por el rol de la conexión.
  return current_user not in ('anon', 'authenticated');
end;
$$;

-- SECURITY INVOKER a propósito: ver la nota de es_administrativa().
create or replace function public.proteger_rol()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.rol is distinct from old.rol then
    -- El rol solo lo cambia la administración del curso, nunca el estudiante.
    if not public.es_administrativa() then
      raise exception 'El rol solo lo puede cambiar la administración del curso.';
    end if;
  end if;

  if new.id is distinct from old.id then
    raise exception 'El identificador del perfil no se puede cambiar.';
  end if;

  new.actualizado_en := now();
  return new;
end;
$$;

drop trigger if exists al_actualizar_perfil on public.perfiles;
create trigger al_actualizar_perfil
  before update on public.perfiles
  for each row execute function public.proteger_rol();

-- ---------------------------------------------------------------------------
-- 10. Registro de intentos con puntaje calculado en el servidor
-- ---------------------------------------------------------------------------
--  El navegador informa evidencia (si acertó, cuántas pistas abrió, cuántos
--  intentos fallidos lleva); el puntaje lo decide esta función a partir del
--  catálogo. Un cliente manipulado no puede inventarse un puntaje.
-- ---------------------------------------------------------------------------

create or replace function public.puntaje_de(
  p_puntos_max       integer,
  p_correcto         boolean,
  p_pistas           integer,
  p_intentos_fallidos integer,
  p_solucion_vista   boolean
) returns integer
language sql
immutable
as $$
  select case
    when not p_correcto then 0
    when p_solucion_vista then 0
    else round(
      p_puntos_max * greatest(
        0.4,
        1.0
          - 0.20 * least(greatest(coalesce(p_pistas, 0), 0), 3)
          - 0.10 * least(greatest(coalesce(p_intentos_fallidos, 0), 0), 3)
      )
    )::integer
  end;
$$;

create or replace function public.registrar_intento(
  p_actividad_id      text,
  p_correcto          boolean,
  p_pistas            integer default 0,
  p_intentos_fallidos integer default 0,
  p_solucion_vista    boolean default false,
  p_datos             jsonb   default '{}'::jsonb,
  p_cliente_id        text    default null
) returns public.mejores
language plpgsql
security definer
set search_path = public
as $$
declare
  v_perfil     uuid := auth.uid();
  v_puntos_max integer;
  v_puntaje    integer;
  v_estado     public.estado_actividad;
  v_cliente    text := coalesce(p_cliente_id, gen_random_uuid()::text);
  v_fila       public.mejores;
  v_filas      integer := 0;
begin
  if v_perfil is null then
    raise exception 'Se necesita una sesión iniciada para guardar un intento.';
  end if;

  select a.puntos_max into v_puntos_max
    from public.actividades a
   where a.id = p_actividad_id;

  if v_puntos_max is null then
    raise exception 'La actividad "%" no existe en el catálogo.', p_actividad_id;
  end if;

  v_puntaje := public.puntaje_de(
    v_puntos_max, p_correcto, p_pistas, p_intentos_fallidos, p_solucion_vista
  );

  v_estado := case
    when p_correcto
         and coalesce(p_pistas, 0) = 0
         and coalesce(p_intentos_fallidos, 0) = 0
         and not coalesce(p_solucion_vista, false) then 'dominada'::public.estado_actividad
    when p_correcto then 'completada'::public.estado_actividad
    else 'intentada'::public.estado_actividad
  end;

  -- Idempotencia: si este cliente_id ya se guardó, no se cuenta dos veces.
  insert into public.intentos (
    perfil_id, actividad_id, correcto, puntaje, pistas_usadas,
    solucion_vista, intentos_fallidos, datos, cliente_id
  )
  values (
    v_perfil, p_actividad_id, p_correcto, v_puntaje, coalesce(p_pistas, 0),
    coalesce(p_solucion_vista, false), coalesce(p_intentos_fallidos, 0),
    coalesce(p_datos, '{}'::jsonb), v_cliente
  )
  on conflict (perfil_id, cliente_id) do nothing;

  get diagnostics v_filas = row_count;

  if v_filas = 0 then
    -- Ya estaba registrado: se devuelve el estado actual sin volver a acumular.
    select * into v_fila from public.mejores
     where perfil_id = v_perfil and actividad_id = p_actividad_id;
    return v_fila;
  end if;

  insert into public.mejores as m (
    perfil_id, actividad_id, mejor_puntaje, estado,
    pistas_minimas, intentos_totales, primera_vez, actualizado_en
  )
  values (
    v_perfil, p_actividad_id, v_puntaje, v_estado,
    coalesce(p_pistas, 0), 1, now(), now()
  )
  on conflict (perfil_id, actividad_id) do update
    set mejor_puntaje  = greatest(m.mejor_puntaje, excluded.mejor_puntaje),
        -- el estado solo avanza: intentada < completada < dominada
        estado = case
          when m.estado = 'dominada' or excluded.estado = 'dominada' then 'dominada'::public.estado_actividad
          when m.estado = 'completada' or excluded.estado = 'completada' then 'completada'::public.estado_actividad
          else 'intentada'::public.estado_actividad
        end,
        pistas_minimas = case
          when excluded.estado <> 'intentada'
            then least(m.pistas_minimas, excluded.pistas_minimas)
          else m.pistas_minimas
        end,
        intentos_totales = m.intentos_totales + 1,
        actualizado_en   = now()
  returning * into v_fila;

  return v_fila;
end;
$$;

revoke all on function public.registrar_intento(text, boolean, integer, integer, boolean, jsonb, text) from public;
grant execute on function public.registrar_intento(text, boolean, integer, integer, boolean, jsonb, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 11. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.grupos            enable row level security;
alter table public.perfiles          enable row level security;
alter table public.docente_grupos    enable row level security;
alter table public.estaciones        enable row level security;
alter table public.actividades       enable row level security;
alter table public.intentos          enable row level security;
alter table public.mejores           enable row level security;
alter table public.borradores        enable row level security;
alter table public.logros            enable row level security;
alter table public.logros_obtenidos  enable row level security;

-- Catálogo: lectura pública (el formulario de registro y la app lo necesitan).
drop policy if exists grupos_lectura on public.grupos;
create policy grupos_lectura on public.grupos
  for select using (true);

drop policy if exists estaciones_lectura on public.estaciones;
create policy estaciones_lectura on public.estaciones
  for select using (true);

drop policy if exists actividades_lectura on public.actividades;
create policy actividades_lectura on public.actividades
  for select using (true);

drop policy if exists logros_lectura on public.logros;
create policy logros_lectura on public.logros
  for select using (true);

-- Perfiles: el estudiante ve y edita el suyo; el docente ve los de sus grupos.
drop policy if exists perfiles_lectura on public.perfiles;
create policy perfiles_lectura on public.perfiles
  for select using (public.puede_ver_perfil(id));

drop policy if exists perfiles_actualiza_propio on public.perfiles;
create policy perfiles_actualiza_propio on public.perfiles
  for update using (id = auth.uid()) with check (id = auth.uid());
--  El cambio de rol lo bloquea el trigger proteger_rol(), no esta política:
--  una política no puede comparar con el valor anterior de la fila.

drop policy if exists perfiles_inserta_propio on public.perfiles;
create policy perfiles_inserta_propio on public.perfiles
  for insert with check (id = auth.uid() and rol = 'estudiante');

-- Docente-grupos: cada docente ve sus asignaciones; nadie se las crea a sí mismo.
drop policy if exists docente_grupos_lectura on public.docente_grupos;
create policy docente_grupos_lectura on public.docente_grupos
  for select using (docente_id = auth.uid());

-- Intentos: propios en escritura; docente autorizado en lectura.
drop policy if exists intentos_lectura on public.intentos;
create policy intentos_lectura on public.intentos
  for select using (public.puede_ver_perfil(perfil_id));

drop policy if exists intentos_insercion on public.intentos;
create policy intentos_insercion on public.intentos
  for insert with check (perfil_id = auth.uid());
--  Sin UPDATE ni DELETE: un intento registrado es evidencia y no se reescribe.

-- Mejores: igual criterio. La escritura real pasa por registrar_intento().
drop policy if exists mejores_lectura on public.mejores;
create policy mejores_lectura on public.mejores
  for select using (public.puede_ver_perfil(perfil_id));

-- Borradores: estrictamente privados del estudiante.
drop policy if exists borradores_propios on public.borradores;
create policy borradores_propios on public.borradores
  for all using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());

-- Logros obtenidos.
drop policy if exists logros_obtenidos_lectura on public.logros_obtenidos;
create policy logros_obtenidos_lectura on public.logros_obtenidos
  for select using (public.puede_ver_perfil(perfil_id));

drop policy if exists logros_obtenidos_insercion on public.logros_obtenidos;
create policy logros_obtenidos_insercion on public.logros_obtenidos
  for insert with check (perfil_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 12. Vistas de apoyo para el panel docente
-- ---------------------------------------------------------------------------

create or replace view public.v_progreso_estudiante
with (security_invoker = true) as
select
  p.id                                   as perfil_id,
  p.nombres,
  p.apellidos,
  p.codigo_estudiantil,
  p.grupo_id,
  g.nombre                               as grupo,
  a.estacion_id,
  a.id                                   as actividad_id,
  a.titulo                               as actividad,
  a.tipo,
  a.nivel,
  a.cuenta_nota,
  a.puntos_max,
  coalesce(m.mejor_puntaje, 0)           as mejor_puntaje,
  m.estado,
  coalesce(m.intentos_totales, 0)        as intentos_totales,
  coalesce(m.pistas_minimas, 0)          as pistas_minimas,
  m.actualizado_en
from public.perfiles p
cross join public.actividades a
left join public.mejores m
       on m.perfil_id = p.id and m.actividad_id = a.id
left join public.grupos g on g.id = p.grupo_id
where p.rol = 'estudiante';

comment on view public.v_progreso_estudiante is
  'Una fila por estudiante y actividad, exista o no un intento. security_invoker = true: '
  'respeta las políticas RLS de quien consulta, así que el docente solo ve sus grupos.';

-- ---------------------------------------------------------------------------
-- 13. Datos semilla mínimos
-- ---------------------------------------------------------------------------

insert into public.grupos (nombre) values
  ('Grupo 1'), ('Grupo 2'), ('Grupo 3')
on conflict (nombre) do nothing;
