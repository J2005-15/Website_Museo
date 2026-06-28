import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { obrasIniciales } from '../data/mockData'
import { getMiPerfilRequest } from '../services/api'

const estadoEstilos = {
  Aprobada: 'bg-emerald-100 text-emerald-600 border-emerald-200/50',
  Pendiente: 'bg-cafe-noir/5 text-cafe-noir/50 border-cafe-noir/10',
  Rechazada: 'bg-red-100 text-red-600 border-red-200/50',
}

const tabs = [
  { id: 'obras', label: 'Mis Obras' },
  { id: 'perfil', label: 'Mi Perfil' },
]

const camposPasswordIniciales = { actual: '', nueva: '', confirmar: '' }

function CultorDashboard({ isOpen, onClose, onOpenUpload, initialTab }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(initialTab || 'obras')
  const [passwordForm, setPasswordForm] = useState(camposPasswordIniciales)
  const [passwordEnviado, setPasswordEnviado] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState({ actual: false, nueva: false, confirmar: false })
  const toggleMostrarPassword = (campo) =>
    setMostrarPassword((prev) => ({ ...prev, [campo]: !prev[campo] }))
  const [wasOpen, setWasOpen] = useState(isOpen)

  // Perfil real del cultor (cédula, parroquia, dirección, etc.), traído del backend
  // vía el token de sesión — ya no se usa la maqueta cultoresIniciales.
  const [perfil, setPerfil] = useState(null)
  const [perfilLoading, setPerfilLoading] = useState(false)
  const [perfilError, setPerfilError] = useState('')

  // Sincroniza la pestaña activa cuando el navbar abre el panel en una pestaña específica
  // (ajuste de estado durante el render, en vez de un efecto, para evitar un commit extra)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) setActiveTab(initialTab || 'obras')
  }

  // Bloquea el scroll de la página pública mientras el panel privado está abierto
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isOpen])

  // Perfil real: se pide cada vez que se abre el panel, usando el token de la sesión.
  useEffect(() => {
    if (!isOpen || !user) return
    setPerfilLoading(true)
    setPerfilError('')
    getMiPerfilRequest(user.token)
      .then(setPerfil)
      .catch((err) => setPerfilError(err.message))
      .finally(() => setPerfilLoading(false))
  }, [isOpen, user])

  if (!isOpen || !user) return null

  // Mientras carga o si falla, se usa el nombre de la sesión (Usuarios) como respaldo;
  // en cuanto el perfil real llega, manda el de Cultores (incluye segundo nombre/apellido).
  const nombreCompleto = perfil
    ? [perfil.primer_nombre, perfil.segundo_nombre, perfil.primer_apellido, perfil.segundo_apellido]
        .filter(Boolean)
        .join(' ')
    : `${user.nombres} ${user.apellidos}`

  // EXCLUSIVAMENTE las obras del cultor logueado: nada de otros artesanos.
  // Pendiente: hoy compara contra la maqueta obrasIniciales por nombre; cuando se
  // conecte el endpoint real de obras, debe filtrarse por id_cultor en el backend.
  const misObras = obrasIniciales.filter((obra) => obra.autor === nombreCompleto)
  const totalObras = misObras.length
  const obrasAprobadas = misObras.filter((o) => o.estado === 'Aprobada').length
  const obrasEnRevision = misObras.filter((o) => o.estado === 'Pendiente').length

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    // Simulación: no hay backend, solo limpiamos el formulario y mostramos confirmación.
    setPasswordForm(camposPasswordIniciales)
    setPasswordEnviado(true)
    setTimeout(() => setPasswordEnviado(false), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#3a200d]/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl lg:max-w-7xl h-auto max-h-[90vh] sm:max-h-none lg:min-h-[85vh] lg:max-h-[92vh] rounded-[2rem] bg-[#F4F0E6] shadow-2xl shadow-black/50 flex flex-col overflow-hidden">

        {/* Cabecera editorial: tapa compacta del panel, mismo ancho y curva que la tarjeta */}
        <div className="relative w-full shrink-0 rounded-t-[2rem] bg-dark-umber px-6 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-5 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full text-linen transition-opacity hover:opacity-70"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center justify-center gap-1 leading-tight">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-warm-sand/80">
              Área Privada · Archivo Táchira
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-gallery-cream leading-tight">
              Portal del Cultor
            </h2>
            <p className="font-sans text-sm text-linen/80 leading-tight">
              Bienvenido, {nombreCompleto}
            </p>
          </div>
        </div>

        {/* Cuerpo: sidebar + contenido, 100% privado */}
        <div className="relative z-10 w-full flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cafe-noir/20 hover:scrollbar-thumb-cafe-noir/40 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cafe-noir/20 hover:[&::-webkit-scrollbar-thumb]:bg-cafe-noir/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12 lg:items-start">

            {/* Tabs: fila apilada/fluida en móvil y tablet, sidebar fijo desde lg: */}
            <nav className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3 lg:w-64 lg:shrink-0 lg:flex-col lg:items-stretch lg:gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full md:w-auto lg:w-full whitespace-nowrap rounded-xl px-4 py-2.5 text-left md:text-center lg:text-left font-sans text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cafe-noir/10 text-cafe-noir font-semibold'
                      : 'text-cafe-noir/60 hover:bg-cafe-noir/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <div className="border-t border-cafe-noir/10 my-1 md:hidden lg:block lg:my-2" />

              <button
                onClick={onOpenUpload}
                className="w-full md:w-auto md:ml-auto lg:w-full lg:ml-0 whitespace-nowrap rounded-xl bg-tertiary px-4 py-2.5 text-left md:text-center lg:text-left font-sans text-sm font-semibold text-linen shadow-md transition-opacity hover:opacity-80"
              >
                + Nueva Postulación
              </button>
            </nav>

            {/* Contenido de la pestaña activa: ocupa todo el espacio restante */}
            <div className="min-w-0 flex-1">
              {activeTab === 'obras' && (
                <div className="w-full min-w-0 overflow-hidden space-y-4">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir">
                    Mis obras enviadas
                  </span>

                  {misObras.length > 0 ? (
                    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm">
                      <table className="w-full min-w-max text-left">
                        <thead>
                          <tr className="border-b border-cafe-noir/10">
                            <th className="px-5 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir/70">Obra</th>
                            <th className="px-5 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir/70">Categoría</th>
                            <th className="px-5 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir/70">Ubicación</th>
                            <th className="px-5 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir/70">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {misObras.map((obra) => (
                            <tr key={obra.id} className="border-b border-cafe-noir/5 last:border-0">
                              <td className="px-5 py-4 font-sans text-sm font-medium text-cafe-noir">{obra.titulo}</td>
                              <td className="px-5 py-4 font-sans text-sm text-cafe-noir/80">{obra.categoria}</td>
                              <td className="px-5 py-4 font-sans text-sm text-cafe-noir/60">{obra.ubicacion}</td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide ${estadoEstilos[obra.estado] || estadoEstilos.Pendiente}`}>
                                  {obra.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-cafe-noir/10 bg-white/50 px-6 py-10 text-center">
                      <p className="font-sans text-sm text-cafe-noir/60">Aún no has postulado obras al archivo.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'perfil' && (
                <div className="space-y-10">
                  {/* Resumen de Actividad */}
                  <div className="space-y-4">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir">
                      Resumen de Actividad
                    </span>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-cafe-noir/10 bg-white/50 px-5 py-6 text-center">
                        <span className="font-serif text-3xl text-cafe-noir">{totalObras}</span>
                        <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir/70">
                          Total de Obras Subidas
                        </p>
                      </div>
                      <div className="rounded-2xl border border-emerald-200/50 bg-emerald-50/60 px-5 py-6 text-center">
                        <span className="font-serif text-3xl text-emerald-700">{obrasAprobadas}</span>
                        <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-wide text-emerald-700/80">
                          Obras Aprobadas
                        </p>
                      </div>
                      <div className="rounded-2xl border border-cafe-noir/10 bg-white/50 px-5 py-6 text-center">
                        <span className="font-serif text-3xl text-cafe-noir">{obrasEnRevision}</span>
                        <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir/70">
                          Obras en Revisión
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Datos personales: reales desde el backend (GET /api/cultores/perfil) */}
                  <div className="space-y-4">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir">
                      Datos Personales
                    </span>

                    {perfilLoading ? (
                      <div className="rounded-2xl border border-cafe-noir/10 bg-white/50 p-6 text-center">
                        <p className="font-sans text-sm text-cafe-noir/60">Cargando tu perfil...</p>
                      </div>
                    ) : perfilError ? (
                      <div className="rounded-2xl border border-red-200/50 bg-red-50/60 p-6 text-center">
                        <p className="font-sans text-sm text-red-700">{perfilError}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-cafe-noir/10 bg-white/50 p-6 sm:grid-cols-2">
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-wide text-cafe-noir/50">Nombre completo</p>
                          <p className="mt-1 font-sans text-sm text-cafe-noir">{nombreCompleto}</p>
                        </div>
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-wide text-cafe-noir/50">Cédula</p>
                          <p className="mt-1 font-sans text-sm text-cafe-noir">{perfil?.cedula || '—'}</p>
                        </div>
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-wide text-cafe-noir/50">Parroquia</p>
                          <p className="mt-1 font-sans text-sm text-cafe-noir">{perfil?.parroquia?.nombre || '—'}</p>
                        </div>
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-wide text-cafe-noir/50">Dirección de residencia</p>
                          <p className="mt-1 font-sans text-sm text-cafe-noir">{perfil?.direccion_residencia || '—'}</p>
                        </div>
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-wide text-cafe-noir/50">Teléfono de contacto</p>
                          <p className="mt-1 font-sans text-sm text-cafe-noir">{perfil?.telefono_contacto || '—'}</p>
                        </div>
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-wide text-cafe-noir/50">Correo de contacto</p>
                          <p className="mt-1 font-sans text-sm text-cafe-noir">{perfil?.correo_contacto || user.correo || '—'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seguridad: cambio de contraseña simulado */}
                  <div className="space-y-4">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir">
                      Seguridad
                    </span>

                    {passwordEnviado && (
                      <div className="rounded-xl border border-emerald-200/50 bg-emerald-50/60 px-4 py-3 font-sans text-sm text-emerald-700">
                        Tu contraseña fue actualizada (simulación local, sin conexión al servidor).
                      </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-2xl border border-cafe-noir/10 bg-white/50 p-6">
                      <div>
                        <label className="block font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir mb-2">
                          Contraseña Actual
                        </label>
                        <div className="relative">
                          <input
                            type={mostrarPassword.actual ? 'text' : 'password'}
                            name="actual"
                            value={passwordForm.actual}
                            onChange={handlePasswordChange}
                            className="w-full rounded-xl border border-cafe-noir/20 bg-white/70 px-4 py-2.5 pr-10 font-sans text-sm shadow-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary"
                          />
                          <button
                            type="button"
                            onClick={() => toggleMostrarPassword('actual')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-noir/40 hover:text-cafe-noir/70 transition-colors"
                            aria-label={mostrarPassword.actual ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          >
                            {mostrarPassword.actual ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir mb-2">
                            Nueva Contraseña
                          </label>
                          <div className="relative">
                            <input
                              type={mostrarPassword.nueva ? 'text' : 'password'}
                              name="nueva"
                              value={passwordForm.nueva}
                              onChange={handlePasswordChange}
                              className="w-full rounded-xl border border-cafe-noir/20 bg-white/70 px-4 py-2.5 pr-10 font-sans text-sm shadow-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary"
                            />
                            <button
                              type="button"
                              onClick={() => toggleMostrarPassword('nueva')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-noir/40 hover:text-cafe-noir/70 transition-colors"
                              aria-label={mostrarPassword.nueva ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                              {mostrarPassword.nueva ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block font-sans text-xs font-semibold uppercase tracking-wide text-cafe-noir mb-2">
                            Confirmar Contraseña
                          </label>
                          <div className="relative">
                            <input
                              type={mostrarPassword.confirmar ? 'text' : 'password'}
                              name="confirmar"
                              value={passwordForm.confirmar}
                              onChange={handlePasswordChange}
                              className="w-full rounded-xl border border-cafe-noir/20 bg-white/70 px-4 py-2.5 pr-10 font-sans text-sm shadow-sm focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary"
                            />
                            <button
                              type="button"
                              onClick={() => toggleMostrarPassword('confirmar')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-noir/40 hover:text-cafe-noir/70 transition-colors"
                              aria-label={mostrarPassword.confirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                              {mostrarPassword.confirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="rounded-full bg-tertiary px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wide text-linen shadow-md transition-opacity hover:opacity-80"
                        >
                          Actualizar Contraseña
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CultorDashboard
