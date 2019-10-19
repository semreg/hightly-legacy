import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const useSignalingSocket = (url, role, props) => {
  const [isConnected, setIsConnected] = useState(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(url)

    newSocket.on('connect', () => {
      newSocket.emit('setRole', role)

      if (props) {
        newSocket.emit('setProps', props)
      }

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

export default useSignalingSocket
