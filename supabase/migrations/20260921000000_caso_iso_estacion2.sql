-- ---------------------------------------------------------------------------
-- Sorteo estable de un caso práctico por estudiante, para el taller de la
-- Estación 2 (ISO/IEC 25010 aplicado a código propio).
--
-- Cada estudiante recibe, al registrarse, un índice fijo (0 a 18) dentro de
-- su grupo, calculado por orden de llegada. Con el banco de 19 casos que
-- vive en el frontend (src/data/estaciones/e2-calidad.js), ese índice
-- selecciona su caso: queda asignado una sola vez, no cambia al recargar la
-- página, y no se repite con otro compañero del mismo grupo mientras el
-- grupo no supere los 19 estudiantes.
--
-- No se guarda el caso en sí (texto), solo el índice: así el banco de casos
-- se puede editar en el frontend sin tocar la base de datos.
-- ---------------------------------------------------------------------------

alter table public.perfiles
  add column if not exists caso_iso_indice integer;

-- Recalcula la función de alta de usuario para asignar el índice al crear el
-- perfil. Se reemplaza completa (no se puede "agregar una línea" a una
-- función ya creada).
create or replace function public.manejar_usuario_nuevo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_grupo uuid;
  v_orden integer;
begin
  -- El grupo llega como nombre; se resuelve contra la tabla. Nunca se crea aquí.
  select g.id into v_grupo
    from public.grupos g
   where g.nombre = nullif(new.raw_user_meta_data ->> 'grupo', '')
   limit 1;

  -- Cuántos estudiantes ya existen en ese grupo: define el índice de este.
  select count(*) into v_orden
    from public.perfiles
   where grupo_id = v_grupo
     and rol = 'estudiante';

  insert into public.perfiles (
    id, nombres, apellidos, correo, codigo_estudiantil, grupo_id, rol, caso_iso_indice
  )
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nombres'), ''), 'Sin nombre'),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'apellidos'), ''), ''),
    new.email,
    nullif(trim(new.raw_user_meta_data ->> 'codigo_estudiantil'), ''),
    v_grupo,
    'estudiante',           -- el rol NUNCA se toma de los metadatos del cliente
    coalesce(v_orden, 0) % 19
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Backfill: a los estudiantes que ya se habían registrado antes de esta
-- migración, se les asigna el índice por orden de registro dentro de su
-- grupo, para que también les quede fijo un caso.
with numerados as (
  select id, (row_number() over (partition by grupo_id order by creado_en) - 1) % 19 as indice
    from public.perfiles
   where rol = 'estudiante'
     and caso_iso_indice is null
)
update public.perfiles p
   set caso_iso_indice = n.indice
  from numerados n
 where p.id = n.id;
