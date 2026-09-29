/**
 * Diagrama genérico de las cinco piezas de un sistema (entrada, proceso,
 * salida, control, retroalimentación), en SVG propio, en la misma paleta de
 * la interfaz. Se usa como apoyo visual en la Estación 3, junto al ejemplo
 * del casino del campus: no depende de ese caso, así que sirve para
 * cualquier sistema que se analice en la estación.
 */
export default function DiagramaSistema() {
  return (
    <svg viewBox="0 0 680 300" width="100%" role="img" aria-label="Diagrama de las cinco piezas de un sistema: control regula el proceso, la entrada pasa a proceso y de ahí a salida, y la retroalimentación vuelve desde la salida hacia el control.">
      <defs>
        <marker id="ds-flecha-flujo" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#1a4fa0" />
        </marker>
        <marker id="ds-flecha-control" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#8a5a00" />
        </marker>
        <marker id="ds-flecha-retro" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#123a78" />
        </marker>
      </defs>

      {/* flujo principal: entrada -> proceso -> salida */}
      <line x1="132" y1="160" x2="276" y2="160" stroke="#1a4fa0" strokeWidth="2.4" markerEnd="url(#ds-flecha-flujo)" />
      <line x1="402" y1="160" x2="546" y2="160" stroke="#1a4fa0" strokeWidth="2.4" markerEnd="url(#ds-flecha-flujo)" />

      {/* control regula el proceso */}
      <line x1="340" y1="76" x2="340" y2="128" stroke="#8a5a00" strokeWidth="2.4" markerEnd="url(#ds-flecha-control)" />

      {/* retroalimentación: de la salida de vuelta al control, entrando por su lado izquierdo para no cruzarse con la flecha de control */}
      <path d="M 607 192 C 650 270, 130 270, 130 50 L 274 46" fill="none" stroke="#123a78" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#ds-flecha-retro)" />

      {/* caja: entrada */}
      <rect x="10" y="128" width="122" height="64" rx="10" fill="#e8f0fc" stroke="#1a4fa0" strokeWidth="1.4" />
      <text x="71" y="166" textAnchor="middle" fontSize="15" fontWeight="600" fill="#123a78">Entrada</text>

      {/* caja: proceso */}
      <rect x="276" y="128" width="126" height="64" rx="10" fill="#e8f0fc" stroke="#1a4fa0" strokeWidth="1.4" />
      <text x="339" y="166" textAnchor="middle" fontSize="15" fontWeight="600" fill="#123a78">Proceso</text>

      {/* caja: salida */}
      <rect x="546" y="128" width="122" height="64" rx="10" fill="#e8f0fc" stroke="#1a4fa0" strokeWidth="1.4" />
      <text x="607" y="166" textAnchor="middle" fontSize="15" fontWeight="600" fill="#123a78">Salida</text>

      {/* caja: control */}
      <rect x="279" y="20" width="120" height="52" rx="10" fill="#fdf3df" stroke="#8a5a00" strokeWidth="1.4" />
      <text x="339" y="51" textAnchor="middle" fontSize="14" fontWeight="600" fill="#8a5a00">Control</text>

      {/* etiqueta de retroalimentación */}
      <text x="380" y="290" textAnchor="middle" fontSize="13" fill="#123a78">Retroalimentación</text>
    </svg>
  )
}
