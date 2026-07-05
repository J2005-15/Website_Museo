import { useState, useEffect, useRef } from 'react'
import { getEfemeridesPublicasRequest } from '../services/api'

const NOMBRES_MES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function Efemerides() {
  const ref = useRef(null)
  const [efemerides, setEfemerides] = useState([])
  const [cargado, setCargado] = useState(false)

  useEffect(() => {
    getEfemeridesPublicasRequest()
      .then(setEfemerides)
      .catch(() => setEfemerides([]))
      .finally(() => setCargado(true))
  }, [])

  if (!cargado) return null
  if (efemerides.length === 0) return null

  return (
    <section id="efemerides" ref={ref} className="relative scroll-mt-20 bg-gallery-cream py-20 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-tertiary">
            Memoria y Tradición
          </span>
          <h2 className="mt-4 font-serif text-4xl text-cafe-noir lg:text-5xl">
            Efemérides Culturales
          </h2>
          <div className="mx-auto mt-6 h-px w-20 bg-primary/40" />
          <p className="mx-auto mt-6 font-sans leading-relaxed text-primary">
            Fechas destacadas del folklore y la historia cultural venezolana.
          </p>
        </div>

        {efemerides.map((efe) => (
          <div key={efe.id_efemeride} className="flex flex-col gap-6 lg:flex-row lg:gap-12 mb-16 lg:mb-24">

            {/* Texto (a la izquierda en desktop) */}
            <div className="order-2 lg:order-1 lg:w-1/2 text-left flex flex-col justify-center">
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-tertiary">
                {efe.dia} de {NOMBRES_MES[efe.mes - 1]}{efe.anio_referencia ? `, ${efe.anio_referencia}` : ''}
              </span>
              <h3 className="mt-4 font-serif text-3xl text-cafe-noir lg:text-4xl lg:leading-tight">
                {efe.titulo}
              </h3>
              <div className="mt-5 h-px w-20 bg-primary/40" />
              {efe.categoria && (
                <p className="mt-5 font-sans text-xs uppercase tracking-widest text-cafe-noir/40">
                  {efe.categoria}
                </p>
              )}
              {efe.descripcion && (
                <p className="mt-4 font-sans text-base lg:text-lg text-cafe-noir/80 leading-relaxed text-justify">
                  {efe.descripcion}
                </p>
              )}
            </div>

            {/* Imagen (a la derecha en desktop) */}
            <div className="order-1 lg:order-2 relative lg:w-1/2">
              <div className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-cafe-noir/10 z-10">
                {efe.imagen ? (
                  <img src={efe.imagen} alt={efe.titulo} className="w-full sepia-[.15] contrast-[1.05] block" />
                ) : (
                  <div className="aspect-[3/2] w-full bg-tertiary/10 flex items-center justify-center">
                    <span className="font-sans text-xs uppercase tracking-widest text-cafe-noir/30">Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 z-0 h-48 w-48 rounded-full border border-cafe-noir/10"></div>
              <div className="absolute -top-6 -left-6 z-0 h-32 w-32 rounded-full border border-cafe-noir/5"></div>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}

export default Efemerides
