import React, { useEffect, useRef, useState } from 'react'
import Layout from '../layouts/Layout'
import Animated from '../other/Animated'
import EmptyEmbed from '../layouts/EmptyEmbed'
import { useAlert } from 'react-alert'
import uuid from 'uuid/v1'
import usePeer from '../../hooks/usePeer'
import useSocketConnection from '../../hooks/useSocketConnection'

function WatchForm (props) {
  const [streamId, setStreamId] = useState(null)
  const [stream, setStream] = useState(null)

  const videoRef = useRef(null)
  const inputRef = useRef(null)

  const [socket, isConnected] = useSocketConnection('http://192.168.0.103:5001', 'watcher')
  const peer = usePeer(uuid(), { host: '192.168.0.103', port: 5002, path: '/peer'})

  const alert = useAlert()

  useEffect(() => {
    if (props.match.params.streamid) {
      setStreamId(props.match.params.streamid)
    }
  }, [])

  useEffect(() => {
    if (socket && streamId && peer) {
      socket.emit('offerNewWatcher', { 
        streamId: streamId,
        watcherId: peer.id
      })

      socket.emit('setWatcherProps', {
        to: streamId,
        watcherId: peer.id
      })

      // return () => {
      //   socket.disconnect()
      // }
    }
  }, [socket, streamId, peer])

  useEffect(() => {
    if (peer) {
      peer.on('call', call => {
        call.answer()
  
        call.on('stream', stream => setStream(stream))

        call.on('error', error => console.log(error))
      })
    }
  }, [peer])

  // Notify user about connection status updates
  useEffect(() => {
    if (isConnected) {
      alert.success('Connected to server')
    } else {
      alert.info('Attempting to connect to server')
    }
  }, [isConnected])

  // Display steram on a page
  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])


  const onBtnClick = () => {
    const id = inputRef.current.value.slice(inputRef.current.value.length - 36)

    // TODO: Add some regex
    if (id.length === 36) {
      setStreamId(id)
    } else {
      alert.error('Your link or id is invalid')
    }
  }

  return (
    <Layout>
      <Animated>
        {streamId
          ? (
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
                  ? <video ref={videoRef} className='embed-responsive-item' controls autoPlay></video>
                  : <EmptyEmbed />
                }
              </div>
              <hr/>
            </div>
          )
          : (
            <div className="jumbotron text-center pt-1">
              <h2 className="card-title h2 mt-4">Enter Your Link</h2>
                <div className="row d-flex justify-content-center">
                  <div className="col-xl-7 pb-2">
                    <p className="card-text">Enter here to connect to stream</p>
                  </div>
                </div>
                <div className="align-center">
                <div className="md-form" style={{'textAlign': 'left', 'color': '#777'}}>
                <i className="fas fa-link prefix"></i>
                  <input ref={inputRef} type="text" id="inputIconEx2" className="form-control" />
                  <label htmlFor="inputIconEx2">Link or stream id</label>
                </div>
                <button onClick={onBtnClick} type="button" className='btn btn-outline-success waves-effect btn-round'>Next <span className="fas fa-play ml-1"></span></button>
              </div>
            </div>
          )
        }
      </Animated>
    </Layout>
  )
}

export default WatchForm
