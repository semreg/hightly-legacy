import React, { useState, useEffect, useRef } from 'react'
import Animated from '../other/Animated'
import EmptyEmbed from '../layouts/EmptyEmbed'
import Layout from '../layouts/Layout'
import { useAlert } from 'react-alert'
import uuid from 'uuid/v1'

import useSocketConnection from '../../hooks/useSocketConnection'
import usePeer from '../../hooks/usePeer'

function StreamForm () {
  const alert = useAlert()

  const [id, setId] = useState(undefined)
  const [stream, setStream] = useState(null)

  const videoRef = useRef(null)

  const [socket, isConnected] = useSocketConnection('http://192.168.0.103:5001', 'streamer')
  const peer = usePeer(uuid(), { host: '192.168.0.103', port: 5002, path: '/peer'})
  
  const [watchers, setWatchers] = useState({})

  // Set stream id
  useEffect(() => {
    if (peer) {
      setId(peer.id)
    }
  }, [peer])

  // Info user about connection status updates
  useEffect(() => {
    if (isConnected) {
      alert.success('Connected to server')
    } else {
      alert.info('Attempting to connect to server')
    }
  }, [isConnected])

  useEffect(() => {
    if (socket && watchers && peer) {
      socket.emit('createStream', { streamId: peer.id })

      socket.on('addNewWatcher', data => {
        console.log(`✅ new watcher <${data.watcherId}> connected`)

        const newWatchers = watchers

        newWatchers[data.watcherId] = false

        setWatchers(newWatchers)
      })

      socket.on('removeWatcher', watcherId => {
        console.log(`❌ watcher <${watcherId}> disconnected`)
      })

      // return () => {
      //   socket.disconnect()
      // }
    }
  }, [socket, watchers, peer])

  // Display captured video
  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    if (stream && peer && isConnected && watchers) {
      console.log('Recalling all peers..')

      for (const id in watchers) {
        const call = peer.call(id, stream)

        if (call) {
          call.on('error', error => console.log(error))
        }
      }
    }
  }, [stream, peer, isConnected, watchers])

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
          <hr/>
        <div className="status-badges">
          <div className='text-muted mt-1'>
            Stream status:&nbsp;&nbsp;
            {stream
              ? <span className="badge badge-danger">Live</span>
              : <span className="badge badge-warning">Inactive</span>
            }
          </div>
          <div className='text-muted mt-1'>
            Server connection status:&nbsp;&nbsp;
            {isConnected
              ? <span className="badge badge-success">Online</span>
              : <span className="badge badge-warning">Offline</span>
            }
          </div>
        </div>
        <hr className="my-4" />
          <div className='embed-responsive embed-responsive-16by9'>
            {stream
              ? <video ref={videoRef} className='embed-responsive-item' autoPlay />
              : <EmptyEmbed />
            }
          </div>
          <hr className="my-4" />
          <div className="pt-2">
            <button onClick={startCapture} type="button" className={`btn btn-outline-success waves-effect btn-round ${stream === null ? '' : 'disabled'}`}>Start <span className="fas fa-play ml-1"></span></button>
            <button onClick={stopCapture} type="button" className={`btn btn-outline-danger waves-effect btn-round ${stream !== null ? '' : 'disabled'}`}>Stop <i className="fas fa-stop"></i></button>
          </div>
          <h2 className="card-title h2 mt-4">Share Your Link</h2>
          <div className="row d-flex justify-content-center">
            <div className="col-xl-7 pb-2">
              <p className="card-text">Share this link so others can see your demonstration</p>
            </div>
          </div>
          <div className="align-center">
          <div className="md-form" style={{'textAlign': 'left', 'color': '#777'}}>
          <i className="fas fa-link prefix"></i>
            <input autoFocus readOnly type="text" id="inputIconEx2" className="form-control" value={`${id ? `http://192.168.0.103:3000/watch/${id}` : ''}`}/>
            <label htmlFor="inputIconEx2">Link to your stream</label>
          </div>
          </div>
        </div>
      </Animated>
    </Layout>
  )
}

export default StreamForm