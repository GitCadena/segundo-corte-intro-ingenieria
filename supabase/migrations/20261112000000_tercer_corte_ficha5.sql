-- Tercer corte · Ficha 5 (segundo proceso, paradigma y lenguaje).
-- Solo amplía las fichas permitidas de (3, 4) a (3, 4, 5). No toca ninguna otra tabla ni dato.

do $$
declare r record;
begin
  for r in
    select c.conrelid::regclass as tabla, c.conname
      from pg_constraint c
      join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
     where c.contype = 'c'
       and c.conrelid in ('public.tercer_corte_fichas'::regclass, 'public.tercer_corte_comentarios'::regclass)
       and a.attname = 'ficha'
       and pg_get_constraintdef(c.oid) like '%3, 4%'
  loop
    execute format('alter table %s drop constraint %I', r.tabla, r.conname);
  end loop;
end $$;

alter table public.tercer_corte_fichas
  add constraint tercer_corte_fichas_ficha_check check (ficha in (3, 4, 5));
alter table public.tercer_corte_comentarios
  add constraint tercer_corte_comentarios_ficha_check check (ficha in (3, 4, 5));

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
  if p_ficha not in (3, 4, 5) then
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
