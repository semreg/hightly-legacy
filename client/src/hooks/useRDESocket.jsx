import { useState, useEffect } from 'react'
import { Base64 } from 'js-base64'

const useRDESocket = rdeKey => {
  const [isRDEActive, setIsRDEActive] = useState(null)
  const [RDEsocket, setRDESocket] = useState(null)

  useEffect(() => {
    try {
      const port = Base64.decode(rdeKey)

      if (Number(port)) {
        const newRDESocket = new WebSocket(`ws://localhost:${port}`)

        newRDESocket.onopen = () => {
          setRDESocket(newRDESocket)
          setIsRDEActive(true)
        }

        newRDESocket.onclose = e => {
          setRDESocket(null)
          setIsRDEActive(false)

          if (e.wasClean) {
            console.log('Connection gracefully closed')
          } else {
            console.log('Disconnected')
          }

          console.log(`Code: ${e.code} reason: ${e.reason}`)
        }

        return () => newRDESocket.close()
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  return [RDEsocket, isRDEActive]
}

export default useRDESocket
