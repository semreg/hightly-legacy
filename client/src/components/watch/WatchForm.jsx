import React, { useEffect, useRef, useState } from 'react'
import Layout from '../layouts/Layout'
import Animated from '../other/Animated'
import { useAlert } from 'react-alert'
import io from 'socket.io-client'
import Peer from 'peerjs'
import uuid from 'uuid/v1'

function WatchForm () {
  const [isConnected, setIsConnected] = useState(false)

  const videoRef = useRef(null)

  const alert = useAlert()

  const peer = new Peer('watcher', {host: '192.168.0.103', port: 9000, path: '/myapp'})

  peer.on('open', id => console.log(id))

  peer.on('call', call => {
    console.log('call')
    call.answer()

    call.on('stream', stream => {
      console.log('stream')

      videoRef.current.srcObject = stream
    })

    call.on('error', err => console.log(err))
  })
  

  useEffect(() => {
    const id = uuid()
    const socket = io('http://localhost:3002')
  
    socket.on('connect', () => {
    })
  }, [])

  return (
    <Layout>
      <Animated>
        <div className="jumbotron text-center pt-1">
          <hr className="my-4" />
          <div className='embed-responsive embed-responsive-16by9'>
            <video ref={videoRef} src='' className='embed-responsive-item' controls autoPlay></video>
          </div>
        </div>
      </Animated>
    </Layout>
  )
}

export default WatchForm