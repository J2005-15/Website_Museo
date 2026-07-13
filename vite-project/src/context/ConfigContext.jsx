import { createContext, useContext, useState, useEffect } from 'react'
import { socket } from '../services/socket'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const ConfigContext = createContext()

export function useConfig() {
  return useContext(ConfigContext)
}

export function ConfigProvider({ children }) {
  const [configWeb, setConfigWeb] = useState(null)
  const [loadingConfig, setLoadingConfig] = useState(true)

  useEffect(() => {
    fetchConfigWeb()
  }, [])

  useEffect(() => {
    socket.on('admin:update', fetchConfigWeb)
    return () => { socket.off('admin:update', fetchConfigWeb) }
  }, [])

  const fetchConfigWeb = async () => {
    try {
      const response = await fetch(`${API_URL}/configuracion-web?_=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setConfigWeb(data)
      } else {
        console.error('Error al obtener la configuración web', response.status)
      }
    } catch (error) {
      console.error('Error de red al obtener configuración web:', error)
    } finally {
      setLoadingConfig(false)
    }
  }

  return (
    <ConfigContext.Provider value={{ configWeb, loadingConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}
