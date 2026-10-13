-- ---------------------------------------------------------------------------
-- El docente puede leer el avance del "Laboratorio de ingeniería: del
-- problema al sistema" (Estación 5, ciclo de vida del desarrollo de sistemas).
--
-- El laboratorio guarda su sesión como un borrador de la cuenta que registra
-- al equipo (tabla `borradores`, igual que los talleres). Esta política agrega
-- una puerta de lectura para el docente, solo para las actividades de tipo
-- 'laboratorio-cdvs'. No toca `borradores_propios` ni `borradores_taller_docente`:
-- en Postgres varias políticas permisivas sobre el mismo comando se combinan
-- con OR, así que esto solo AGREGA una forma de leer y no quita ninguna.
--
-- ORDEN: aplicar primero 20260915130000_catalogo.sql (regenerado), que crea la
-- fila de la actividad con ese tipo; si no existe, la política no devuelve nada.
-- No modifica filas existentes ni afecta puntajes, intentos ni notas.
-- ---------------------------------------------------------------------------

drop policy if exists borradores_laboratorio_docente on public.borradores;
create policy borradores_laboratorio_docente on public.borradores
  for select using (
    public.puede_ver_perfil(perfil_id)
    and exists (
      select 1 from public.actividades a
       where a.id = actividad_id
         and a.tipo = 'laboratorio-cdvs'
    )
  );
