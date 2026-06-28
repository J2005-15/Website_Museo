function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 font-sans text-sm text-cafe-noir cursor-pointer select-none">
      {/* El <input> real va oculto (sr-only) por accesibilidad/semántica; el cuadro
          visible es este <span> hermano — por eso el contraste se ajusta aquí. */}
      <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="absolute inset-0 rounded-[3px] border border-cafe-noir/40 bg-white transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-1 peer-focus-visible:ring-cafe-noir peer-focus-visible:ring-offset-1" />
        <svg
          className="relative h-2.5 w-2.5 text-linen opacity-0 transition-opacity peer-checked:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
      {label}
    </label>
  )
}

export default Checkbox
