-- ---------------------------------------------------------------------------
-- El docente puede leer lo que los estudiantes escribieron en los talleres
-- (Estación 1 "Un problema del campus", Estación 2 "Tu proyecto, tu pasión",
-- etc.), sin abrir el resto de "borradores" (por ejemplo el código a medio
-- terminar del Laboratorio), que siguen siendo estrictamente privados.
--
-- No se toca la política existente `borradores_propios` (el estudiante
-- sigue viendo y editando los suyos exactamente igual): en Postgres, varias
-- políticas RLS "permissive" sobre el mismo comando se combinan con OR, así
-- que esto solo AGREGA una puerta de lectura adicional, nunca quita ninguna.
-- No modifica ninguna fila existente ni afecta puntajes, intentos ni notas.
-- ---------------------------------------------------------------------------

drop policy if exists borradores_taller_docente on public.borradores;
create policy borradores_taller_docente on public.borradores
  for select using (
    public.puede_ver_perfil(perfil_id)
    and exists (
      select 1 from public.actividades a
       where a.id = actividad_id
         and a.tipo = 'taller'
    )
  );
