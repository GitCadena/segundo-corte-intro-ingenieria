-- Un equipo concreto (Tienda Gamer, código E16B3E) puede tener 5 integrantes.
-- El resto de equipos sigue con el límite de 4: max_integrantes vacío = 4.
alter table public.tercer_corte_equipos add column if not exists max_integrantes integer;

update public.tercer_corte_equipos set max_integrantes = 5 where codigo = 'E16B3E' and nombre = 'Tienda Gamer';

create or replace function public.tercer_corte_unirse(p_codigo text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_equipo uuid;
  v_max integer;
begin
  if auth.uid() is null or public.mi_rol() is distinct from 'estudiante' then
    raise exception 'Solo los estudiantes pueden unirse a un equipo.';
  end if;
  if exists (select 1 from public.tercer_corte_miembros where perfil_id = auth.uid()) then
    raise exception 'Ya perteneces a un equipo.';
  end if;
  select id, coalesce(max_integrantes, 4) into v_equipo, v_max
    from public.tercer_corte_equipos where codigo = upper(btrim(coalesce(p_codigo, '')));
  if v_equipo is null then
    raise exception 'No existe un equipo con ese código.';
  end if;
  if (select count(*) from public.tercer_corte_miembros where equipo_id = v_equipo) >= v_max then
    raise exception 'El equipo ya tiene % integrantes.', v_max;
  end if;
  insert into public.tercer_corte_miembros (equipo_id, perfil_id) values (v_equipo, auth.uid());
  return v_equipo;
end;
$$;
