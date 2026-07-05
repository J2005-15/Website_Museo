import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const SOCKET_URL = API_URL.replace('/api', '')

console.log('[Socket] Conectando a:', SOCKET_URL)

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
})

socket.on('connect', () => {
  console.log('[Socket] Conectado exitosamente, ID:', socket.id)
})

socket.on('connect_error', (err) => {
  console.error('[Socket] Error de conexión:', err.message)
})

socket.on('disconnect', (reason) => {
  console.log('[Socket] Desconectado:', reason)
})
