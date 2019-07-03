import React, { useState, useEffect, useRef } from 'react'
import Animated from '../other/Animated'
import Layout from '../layouts/Layout'
import { useAlert } from 'react-alert'
import io from 'socket.io-client'
import Peer from 'peerjs'
import uuid from 'uuid/v1'

function StreamForm () {
  const alert = useAlert()

  const [id, setId] = useState(undefined)
  const [stream, setStream] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [peer, setPeer] = useState(null)

  const videoRef = useRef(null)

  useEffect(() => {
    alert.show('Your browser doesn\'t support audio capturing')

    // startCapture()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const socket = io('http://localhost:3002')
    const newPeer = new Peer('streamer', {host: '192.168.0.103', port: 9000, path: '/myapp'})

    newPeer.on('open', id => {
      console.log(id)
      setPeer(newPeer)
    })

    newPeer.on('error', error => console.log(error))

    let connectedPeers = {}

    if (newPeer && socket) {
      socket.on('connect', () => {
        alert.success('Connected to server')
        setIsConnected(true)      
        setId(newPeer.id)
      })
  
      socket.emit('createstream', { data: newPeer.id })
  
      socket.on('disconnect', () => {
        alert.error('Disconnected from server')
        setIsConnected(false)
      })
    }
  }, [])

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream
    }

    console.log(`Stream status: ${stream ? 'running' : 'disabled'}`)
  }, [stream])

  useEffect(() => {
    if (isConnected && stream && peer) {
      const call = peer.call('watcher', stream)

      console.log('calling...')
    }
  }, [stream])

  async function startCapture (displayMediaOptions) {
    let captureStream = null
  
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    } catch (err) {
      console.error(err)
    }
  
    setStream(captureStream)
  }

  function stopCapture () {
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject
      .getTracks()
      .forEach(track => track.stop())
      
      setStream(null)
      videoRef.current.srcObject = null
    }
  }

  return (
    <Layout>
     <Animated>
        <div className="jumbotron text-center pt-1">
          <hr className="my-4" />
            <div className='embed-responsive embed-responsive-16by9'>
              {stream
                ? <video ref={videoRef} src='' className='embed-responsive-item' autoPlay></video>
                : <svg className="embed-responsive-item" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="45%" y="50%" fill="#eceeef" dy=".3em">Stream is disabled</text></svg>
              }
            </div>
          <hr className="my-4" />
          <div className="pt-2">
            <button onClick={startCapture} type="button" className={`btn btn-outline-success waves-effect btn-round ${stream === null ? '' : 'disabled'}`}>Start <span className="fas fa-play ml-1"></span></button>
            <button onClick={stopCapture} type="button" className={`btn btn-outline-danger waves-effect btn-round ${stream !== null ? '' : 'disabled'}`}>Stop <i className="fas fa-stop"></i></button>
          </div>
          <p className='text-muted mt-4'>
            Server connection status:&nbsp;
            {isConnected
              ? <span className="badge badge-success">Online</span>
              : <span className="badge badge-danger">Offline</span>
            }
          </p>
          <h2 className="card-title h2 mt-4">Share Your Link</h2>
          <div className="row d-flex justify-content-center">
        <div className="col-xl-7 pb-2">
          <p className="card-text">Share this link so others can see your demonstration</p>
        </div>
      </div>
          <div className="align-center">
          <div className="md-form" style={{'textAlign': 'left', 'color': '#777'}}>
          <i className="fas fa-link prefix"></i>
            <input autoFocus readOnly type="text" id="inputIconEx2" className="form-control" value={`${id ? `https://screenstream.nbt-team.com/watch?streamid=${id}` : ''}`}/>
            <label htmlFor="inputIconEx2">Link to your stream</label>
          </div>
          </div>
        </div>
      </Animated>
    </Layout>
  )
}

export default StreamForm