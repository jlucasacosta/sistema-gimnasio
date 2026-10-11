import { etiquetaAforo, reglaAforo, rellenoAforo, type NivelAforo } from "./aforo"

// leyenda-aforo.tsx · La escala de colores de la ocupacion, explicada junto al grafico.
// Los umbrales salen de theme.aforo (via shell/aforo.ts): si se cambian, la leyenda cambia sola.
const niveles: NivelAforo[] = ["espacio", "casi", "lleno"]

export function LeyendaAforo({ className = "" }: { className?: string }) {
  return (
    <ul aria-label="Cómo leer los colores de ocupación" className={"flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted " + className}>
      {niveles.map((n) => (
        <li key={n} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={"inline-block h-2.5 w-2.5 rounded-sm " + rellenoAforo[n]} />
          <span>
            <span className="text-fg">{etiquetaAforo[n]}</span> · {reglaAforo(n)}
          </span>
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-danger shadow-[0_0_0_2px_rgb(var(--danger)/0.5)]" />
        <span>
          <span className="text-fg">COMPLETO</span> · tope de la clase
        </span>
      </li>
    </ul>
  )
}
