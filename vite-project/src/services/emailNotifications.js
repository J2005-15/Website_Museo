import emailjs from '@emailjs/browser'

// Misma cuenta/plantilla de EmailJS que usa frontend_archivo — los templates no están
// atados a un dominio, así que la web pública puede reutilizar la plantilla de
// "Recuperación" sin necesidad de crear una tercera (el plan gratuito solo permite 2).
const SERVICE_ID = 'service_7hx0c0g'
const PUBLIC_KEY = 'YooUZzNutgPtDP_rR'
const TEMPLATE_RECUPERACION = 'template_cpqo3rn'

// Recuperación de contraseña con enlace real (token persistido en BD por el backend).
// Variables de plantilla: {{to_email}}, {{nombre_usuario}}, {{reset_link}}
export function enviarRecuperacion({ correo, nombre, resetLink }) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_RECUPERACION,
    { to_email: correo, nombre_usuario: nombre, reset_link: resetLink },
    PUBLIC_KEY
  )
}
