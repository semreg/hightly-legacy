import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../layouts/Layout'
import Animated from '../other/Animated'
import EmptyEmbed from '../layouts/EmptyEmbed'
import { useAlert } from 'react-alert'
import uuid from 'uuid/v1'
import config from '../../config'
import { object } from 'prop-types'

// Custom hooks
import usePeer from '../../hooks/usePeer'
import useSocketConnection from '../../hooks/useSocketConnection'

const propTypes = { match: object }

function WatchForm ({ match }) {
  const [streamId, setStreamId] = useState(null)
  const [stream, setStream] = useState(null)

  const videoRef = useRef(null)
  const inputRef = useRef(null)

  const [socket, isConnected] = useSocketConnection(config.SIGNALING_SERVER_URL, 'viewer')

  const peer = usePeer(uuid(), {
    host: config.PEER_SERVER_HOST,
    port: config.PEER_SERVER_PORT,
    path: '/peer'
  })

  const alert = useAlert()

  useEffect(() => {
    console.log(match)

    if (match.params.streamid) {
      setStreamId(match.params.streamid)
    }
  }, [])

  useEffect(() => {
    if (socket && streamId && peer) {
      socket.emit('offerNewViewer', {
        streamId: streamId,
        viewerId: peer.id
      })

      socket.emit('setViewerProps', {
        to: streamId,
        viewerId: peer.id
      })
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
        <Helmet>
          <title>Hightly &#183; Watch</title>
        </Helmet>
        {streamId
          ? (
            <div className='jumbotron text-center pt-1'>
              <hr/>
              <div className='status-badges-viewer'>
                <div className='text-muted mt-1'>
                Server connection status:&nbsp;&nbsp;
                  {isConnected
                    ? <span className='badge badge-success'>Online</span>
                    : <span className='badge badge-warning'>Offline</span>
                  }
                </div>
              </div>
              <hr className='my-4' />
              <div className='embed-responsive embed-responsive-16by9'>
                {stream
                  ? <video ref={videoRef} className='embed-responsive-item' controls autoPlay></video>
                  : <EmptyEmbed role='viewer'/>
                }
              </div>
              <hr/>
            </div>
          )
          : (
            <div className='jumbotron text-center pt-1'>
              <h2 className='card-title h2 mt-4'>Enter Your Link</h2>
              <div className='row d-flex justify-content-center'>
                <div className='col-xl-7 pb-2'>
                  <p className='card-text'>Enter here to connect to stream</p>
                </div>
              </div>
              <div className='align-center'>
                <div className='md-form' style={{ 'textAlign': 'left', 'color': '#777' }}>
                  <i className='fas fa-link prefix'></i>
                  <input ref={inputRef} type='text' id='inputIconEx2' className='form-control' />
                  <label htmlFor='inputIconEx2'>Link or stream id</label>
                </div>
                <button onClick={onBtnClick} type='button' className='btn btn-outline-success waves-effect btn-round'>Next <span className='fas fa-play ml-1'></span></button>
              </div>
            </div>
          )
        }
      </Animated>
    </Layout>
  )
}

WatchForm.propTypes = propTypes

export default WatchForm
