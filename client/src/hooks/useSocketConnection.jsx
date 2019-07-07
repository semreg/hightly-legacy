import { useState, useEffect } from 'react'
import io from 'socket.io-client'

function useSocketConnection (url, role) {
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(url)

    newSocket.on('connect', () => {
      newSocket.emit('setRole', role)

      setSocket(newSocket)
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setSocket(newSocket)
      setIsConnected(false)
    })

    return () => newSocket.destroy()
  }, [])

  return [socket, isConnected]
}

export default useSocketConnection
