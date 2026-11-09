-- ---------------------------------------------------------------------------
-- Tercer corte · equipos y fichas
--
-- ADITIVA y aislada: crea tablas y funciones con prefijo tercer_corte_ y no
-- modifica nada del segundo corte (actividades, mejores, intentos, borradores,
-- logros, notas, perfiles ni sus políticas). Reutiliza en solo lectura las
-- funciones docente_ve_grupo() y mi_rol() que ya existen.
--
-- Acceso: cualquier estudiante autenticado puede crear un equipo o unirse a uno
-- (máximo 4 integrantes, un solo equipo por estudiante). Los docentes ven los
-- equipos cuyos integrantes pertenecen a un grupo que tienen asignado en
-- docente_grupos. Todas las escrituras pasan por funciones: las tablas no
-- tienen políticas de INSERT/UPDATE/DELETE directas.
-- ---------------------------------------------------------------------------

create table if not exists public.tercer_corte_equipos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null check (char_length(btrim(nombre)) between 3 and 60),
  codigo      text not null unique,
  creado_por  uuid not null references public.perfiles(id) on delete cascade,
  creado_en   timestamptz not null default now()
);

create table if not exists public.tercer_corte_miembros (
  equipo_id  uuid not null references public.tercer_corte_equipos(id) on delete cascade,
  perfil_id  uuid not null references public.perfiles(id) on delete cascade,
  unido_en   timestamptz not null default now(),
  primary key (equipo_id, perfil_id),
  unique (perfil_id)
);

create table if not exists public.tercer_corte_fichas (
  equipo_id       uuid not null references public.tercer_corte_equipos(id) on delete cascade,
  ficha           integer not null check (ficha in (3, 4)),
  contenido       jsonb not null default '{}'::jsonb,
  estado          text not null default 'en_progreso' check (estado in ('en_progreso', 'entregada')),
  entregada_en    timestamptz,
  entregada_por   uuid references public.perfiles(id) on delete set null,
  actualizado_en  timestamptz not null default now(),
  actualizado_por uuid references public.perfiles(id) on delete set null,
  primary key (equipo_id, ficha)
);

create table if not exists public.tercer_corte_comentarios (
  id         uuid primary key default gen_random_uuid(),
  equipo_id  uuid not null references public.tercer_corte_equipos(id) on delete cascade,
  ficha      integer not null check (ficha in (3, 4)),
  seccion    text not null,
  autor_id   uuid not null references public.perfiles(id) on delete cascade,
  texto      text not null check (char_length(btrim(texto)) between 1 and 1000),
  creado_en  timestamptz not null default now()
);

create index if not exists tercer_corte_comentarios_equipo_idx
  on public.tercer_corte_comentarios (equipo_id, ficha, creado_en);

-- ---------------------------------------------------------------------------
-- Funciones de apoyo (SECURITY DEFINER para no recursar sobre RLS)
-- ---------------------------------------------------------------------------

create or replace function public.tc_es_miembro(p_equipo uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.tercer_corte_miembros m
     where m.equipo_id = p_equipo and m.perfil_id = auth.uid()
  );
$$;

create or replace function public.tc_es_docente_del_equipo(p_equipo uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
      from public.tercer_corte_miembros m
      join public.perfiles p on p.id = m.perfil_id
     where m.equipo_id = p_equipo
       and p.grupo_id is not null
       and public.docente_ve_grupo(p.grupo_id)
  );
$$;

-- ---------------------------------------------------------------------------
-- Lectura (RLS): miembros del equipo y docentes del grupo
-- ---------------------------------------------------------------------------

alter table public.tercer_corte_equipos      enable row level security;
alter table public.tercer_corte_miembros     enable row level security;
alter table public.tercer_corte_fichas       enable row level security;
alter table public.tercer_corte_comentarios  enable row level security;

drop policy if exists tc_equipos_lectura on public.tercer_corte_equipos;
create policy tc_equipos_lectura on public.tercer_corte_equipos
  for select using (public.tc_es_miembro(id) or public.tc_es_docente_del_equipo(id));

drop policy if exists tc_miembros_lectura on public.tercer_corte_miembros;
create policy tc_miembros_lectura on public.tercer_corte_miembros
  for select using (public.tc_es_miembro(equipo_id) or public.tc_es_docente_del_equipo(equipo_id));

drop policy if exists tc_fichas_lectura on public.tercer_corte_fichas;
create policy tc_fichas_lectura on public.tercer_corte_fichas
  for select using (public.tc_es_miembro(equipo_id) or public.tc_es_docente_del_equipo(equipo_id));

drop policy if exists tc_comentarios_lectura on public.tercer_corte_comentarios;
create policy tc_comentarios_lectura on public.tercer_corte_comentarios
  for select using (public.tc_es_miembro(equipo_id) or public.tc_es_docente_del_equipo(equipo_id));

-- Los docentes comentan solo en equipos de sus grupos y a su nombre.
drop policy if exists tc_comentarios_docente_inserta on public.tercer_corte_comentarios;
create policy tc_comentarios_docente_inserta on public.tercer_corte_comentarios
  for insert with check (
    autor_id = auth.uid()
    and public.tc_es_docente_del_equipo(equipo_id)
  );

-- ---------------------------------------------------------------------------
-- Escritura: solo mediante funciones
-- ---------------------------------------------------------------------------

create or replace function public.tercer_corte_crear_equipo(p_nombre text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_id uuid;
  v_codigo text;
  v_intentos integer := 0;
begin
  if auth.uid() is null or public.mi_rol() is distinct from 'estudiante' then
    raise exception 'Solo los estudiantes pueden crear un equipo.';
  end if;
  if exists (select 1 from public.tercer_corte_miembros where perfil_id = auth.uid()) then
    raise exception 'Ya perteneces a un equipo.';
  end if;
  if char_length(btrim(coalesce(p_nombre, ''))) < 3 then
    raise exception 'El nombre del proyecto necesita al menos 3 caracteres.';
  end if;
  loop
    v_codigo := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.tercer_corte_equipos where codigo = v_codigo);
    v_intentos := v_intentos + 1;
    if v_intentos > 20 then raise exception 'No se pudo generar el código.'; end if;
  end loop;
  insert into public.tercer_corte_equipos (nombre, codigo, creado_por)
    values (btrim(p_nombre), v_codigo, auth.uid())
    returning id into v_id;
  insert into public.tercer_corte_miembros (equipo_id, perfil_id) values (v_id, auth.uid());
  return v_id;
end;
$$;

create or replace function public.tercer_corte_unirse(p_codigo text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_equipo uuid;
begin
  if auth.uid() is null or public.mi_rol() is distinct from 'estudiante' then
    raise exception 'Solo los estudiantes pueden unirse a un equipo.';
  end if;
  if exists (select 1 from public.tercer_corte_miembros where perfil_id = auth.uid()) then
    raise exception 'Ya perteneces a un equipo.';
  end if;
  select id into v_equipo from public.tercer_corte_equipos where codigo = upper(btrim(coalesce(p_codigo, '')));
  if v_equipo is null then
    raise exception 'No existe un equipo con ese código.';
  end if;
  if (select count(*) from public.tercer_corte_miembros where equipo_id = v_equipo) >= 4 then
    raise exception 'El equipo ya tiene 4 integrantes.';
  end if;
  insert into public.tercer_corte_miembros (equipo_id, perfil_id) values (v_equipo, auth.uid());
  return v_equipo;
end;
$$;

-- Guarda solo los campos enviados y los fusiona con lo que ya hay, para que dos
-- integrantes editando campos distintos no se pisen. Rechaza fichas entregadas.
create or replace function public.tercer_corte_guardar(p_equipo uuid, p_ficha integer, p_campos jsonb)
returns timestamptz
language plpgsql security definer set search_path = public
as $$
declare
  v_estado text;
  v_ahora timestamptz := now();
begin
  if not public.tc_es_miembro(p_equipo) then
    raise exception 'No perteneces a este equipo.';
  end if;
  if p_ficha not in (3, 4) then
    raise exception 'Ficha no válida.';
  end if;
  if jsonb_typeof(p_campos) is distinct from 'object' then
    raise exception 'Formato no válido.';
  end if;
  if octet_length(p_campos::text) > 200000 then
    raise exception 'El contenido es demasiado grande.';
  end if;
  select estado into v_estado from public.tercer_corte_fichas where equipo_id = p_equipo and ficha = p_ficha;
  if v_estado = 'entregada' then
    raise exception 'La ficha ya fue entregada: el docente debe reabrirla para editarla.';
  end if;
  insert into public.tercer_corte_fichas (equipo_id, ficha, contenido, actualizado_en, actualizado_por)
    values (p_equipo, p_ficha, p_campos, v_ahora, auth.uid())
  on conflict (equipo_id, ficha) do update
    set contenido = public.tercer_corte_fichas.contenido || excluded.contenido,
        actualizado_en = v_ahora,
        actualizado_por = auth.uid();
  return v_ahora;
end;
$$;

create or replace function public.tercer_corte_entregar(p_equipo uuid, p_ficha integer)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.tc_es_miembro(p_equipo) then
    raise exception 'No perteneces a este equipo.';
  end if;
  update public.tercer_corte_fichas
     set estado = 'entregada', entregada_en = now(), entregada_por = auth.uid(),
         actualizado_en = now(), actualizado_por = auth.uid()
   where equipo_id = p_equipo and ficha = p_ficha and estado = 'en_progreso';
  if not found then
    raise exception 'No hay una ficha en progreso para entregar.';
  end if;
end;
$$;

create or replace function public.tercer_corte_reabrir(p_equipo uuid, p_ficha integer)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.tc_es_docente_del_equipo(p_equipo) then
    raise exception 'Solo el docente del grupo puede reabrir una ficha.';
  end if;
  update public.tercer_corte_fichas
     set estado = 'en_progreso', entregada_en = null, entregada_por = null
   where equipo_id = p_equipo and ficha = p_ficha;
end;
$$;

-- ---------------------------------------------------------------------------
-- Lecturas empaquetadas (nombres de integrantes, que RLS de perfiles no deja ver)
-- ---------------------------------------------------------------------------

create or replace function public.tercer_corte_mi_equipo()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_equipo uuid;
begin
  select equipo_id into v_equipo from public.tercer_corte_miembros where perfil_id = auth.uid();
  if v_equipo is null then
    return null;
  end if;
  return jsonb_build_object(
    'id', v_equipo,
    'nombre', (select nombre from public.tercer_corte_equipos where id = v_equipo),
    'codigo', (select codigo from public.tercer_corte_equipos where id = v_equipo),
    'miembros', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'perfil_id', p.id, 'nombres', p.nombres, 'apellidos', p.apellidos) order by m.unido_en), '[]'::jsonb)
        from public.tercer_corte_miembros m join public.perfiles p on p.id = m.perfil_id
       where m.equipo_id = v_equipo),
    'fichas', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'ficha', f.ficha, 'estado', f.estado, 'actualizado_en', f.actualizado_en)), '[]'::jsonb)
        from public.tercer_corte_fichas f where f.equipo_id = v_equipo)
  );
end;
$$;

create or replace function public.tercer_corte_ficha(p_equipo uuid, p_ficha integer)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
begin
  if not (public.tc_es_miembro(p_equipo) or public.tc_es_docente_del_equipo(p_equipo)) then
    raise exception 'Sin acceso a esta ficha.';
  end if;
  return coalesce((
    select jsonb_build_object(
      'ficha', f.ficha, 'contenido', f.contenido, 'estado', f.estado,
      'entregada_en', f.entregada_en, 'actualizado_en', f.actualizado_en,
      'actualizado_por', (select nombres || ' ' || apellidos from public.perfiles where id = f.actualizado_por),
      'comentarios', (
        select coalesce(jsonb_agg(jsonb_build_object(
                 'id', c.id, 'seccion', c.seccion, 'texto', c.texto, 'creado_en', c.creado_en,
                 'autor', (select nombres || ' ' || apellidos from public.perfiles where id = c.autor_id)
               ) order by c.creado_en), '[]'::jsonb)
          from public.tercer_corte_comentarios c where c.equipo_id = p_equipo and c.ficha = p_ficha)
    )
    from public.tercer_corte_fichas f where f.equipo_id = p_equipo and f.ficha = p_ficha
  ), jsonb_build_object('ficha', p_ficha, 'contenido', '{}'::jsonb, 'estado', 'en_progreso',
                        'entregada_en', null, 'actualizado_en', null, 'actualizado_por', null,
                        'comentarios', (
                          select coalesce(jsonb_agg(jsonb_build_object(
                                   'id', c.id, 'seccion', c.seccion, 'texto', c.texto, 'creado_en', c.creado_en,
                                   'autor', (select nombres || ' ' || apellidos from public.perfiles where id = c.autor_id)
                                 ) order by c.creado_en), '[]'::jsonb)
                            from public.tercer_corte_comentarios c where c.equipo_id = p_equipo and c.ficha = p_ficha)));
end;
$$;

-- Listado para el docente: equipos de sus grupos, con integrantes y estado de cada ficha.
create or replace function public.tercer_corte_listado()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
begin
  if public.mi_rol() not in ('docente', 'admin') then
    raise exception 'Solo para docentes.';
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', e.id, 'nombre', e.nombre, 'codigo', e.codigo,
      'miembros', (
        select coalesce(jsonb_agg(jsonb_build_object(
                 'nombres', p.nombres, 'apellidos', p.apellidos, 'grupo',
                 (select nombre from public.grupos where id = p.grupo_id)) order by m.unido_en), '[]'::jsonb)
          from public.tercer_corte_miembros m join public.perfiles p on p.id = m.perfil_id
         where m.equipo_id = e.id),
      'fichas', (
        select coalesce(jsonb_agg(jsonb_build_object(
                 'ficha', f.ficha, 'estado', f.estado, 'actualizado_en', f.actualizado_en,
                 'entregada_en', f.entregada_en)), '[]'::jsonb)
          from public.tercer_corte_fichas f where f.equipo_id = e.id)
    ) order by e.creado_en)
    from public.tercer_corte_equipos e
    where public.tc_es_docente_del_equipo(e.id)
  ), '[]'::jsonb);
end;
$$;

grant execute on function public.tercer_corte_crear_equipo(text) to authenticated;
grant execute on function public.tercer_corte_unirse(text) to authenticated;
grant execute on function public.tercer_corte_guardar(uuid, integer, jsonb) to authenticated;
grant execute on function public.tercer_corte_entregar(uuid, integer) to authenticated;
grant execute on function public.tercer_corte_reabrir(uuid, integer) to authenticated;
grant execute on function public.tercer_corte_mi_equipo() to authenticated;
grant execute on function public.tercer_corte_ficha(uuid, integer) to authenticated;
grant execute on function public.tercer_corte_listado() to authenticated;

-- Solo usuarios con sesión pueden ejecutarlas (además, cada una valida auth.uid()).
revoke execute on function public.tercer_corte_crear_equipo(text) from public, anon;
revoke execute on function public.tercer_corte_unirse(text) from public, anon;
revoke execute on function public.tercer_corte_guardar(uuid, integer, jsonb) from public, anon;
revoke execute on function public.tercer_corte_entregar(uuid, integer) from public, anon;
revoke execute on function public.tercer_corte_reabrir(uuid, integer) from public, anon;
revoke execute on function public.tercer_corte_mi_equipo() from public, anon;
revoke execute on function public.tercer_corte_ficha(uuid, integer) from public, anon;
revoke execute on function public.tercer_corte_listado() from public, anon;
