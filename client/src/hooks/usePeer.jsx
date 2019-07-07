import { useState, useEffect } from 'react'
import Peer from 'peerjs'

function usePeer (id, opts) {
  const [peer, setPeer] = useState(null)

  useEffect(() => {
    const newPeer = new Peer(id, opts)

    newPeer.on('open', () => {
      setPeer(newPeer)
    })

    newPeer.on('close', () => {
      setPeer(null)
    })

    return () => newPeer.destroy()
  }, [])

  return peer
}

export default usePeer
