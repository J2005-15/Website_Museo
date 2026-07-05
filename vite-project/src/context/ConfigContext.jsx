import { createContext, useContext, useState, useEffect } from 'react'
import { socket } from '../services/socket'

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
      // Usamos el puerto 3000 que es donde está el backend
      const response = await fetch(`http://localhost:3000/api/configuracion-web?_=${Date.now()}`)
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
