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

  useEffect(() => {
    const id = uuid()
    const socket = io('http://localhost:3002')
    const peer = new Peer('532f1860-9b38-11e9-a2ca-4b906b85ebcd')

    navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
      const call = peer.call('another-peers-id', stream);
      call.on('stream', (remoteStream) => {
        videoRef.current.srcObject = remoteStream
      });
    }, (err) => {
      console.error('Failed to get local stream', err);
    });

    // socket.on('connect', () => {
    //   alert.success('Connected to server')
    //   setIsConnected(true)

    //   socket.emit('newwatcher', { 
    //     id: '532f1860-9b38-11e9-a2ca-4b906b85ebcd',
    //     stream: '24d2f630-9b38-11e9-9bdf-8b2c6cc80f2c'
    //   })
    // })

    // socket.on('disconnect', () => {
    //   alert.error('Disconnected from server')
    //   setIsConnected(false)
    // })
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