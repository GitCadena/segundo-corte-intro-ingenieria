-- La ficha 4 deja de recibir entregas el 12 de noviembre de 2026 a las 11:30 a. m. (hora de Colombia).
create or replace function public.tercer_corte_entregar(p_equipo uuid, p_ficha integer)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.tc_es_miembro(p_equipo) then
    raise exception 'No perteneces a este equipo.';
  end if;
  if p_ficha = 4 and now() >= timestamptz '2026-11-12 11:30:00-05' then
    raise exception 'El plazo para entregar la ficha 4 cerró el 12 de noviembre a las 11:30 a. m.';
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
