function Radio({ name, value, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 font-sans text-sm text-cafe-noir cursor-pointer select-none">
      {/* El <input> real va oculto (sr-only) por accesibilidad/semántica; el círculo
          visible es este <span> hermano — por eso el contraste se ajusta aquí. */}
      <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full border border-cafe-noir/40 bg-white transition-colors peer-checked:border-primary peer-focus-visible:ring-1 peer-focus-visible:ring-cafe-noir peer-focus-visible:ring-offset-1" />
        <span className="relative h-1.5 w-1.5 scale-0 rounded-full bg-primary transition-transform duration-150 peer-checked:scale-100" />
      </span>
      {label}
    </label>
  )
}

export default Radio
