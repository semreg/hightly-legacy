import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../layouts/Layout'
import Animated from '../other/Animated'
import EmptyEmbed from '../layouts/EmptyEmbed'
import { useAlert } from 'react-alert'
import uuid from 'uuid/v1'
import { object } from 'prop-types'
import './watch-form.scss'
import { getCoords, getNaturalCoords } from '../../utils/coords'

// Custom hooks
import usePeer from '../../hooks/usePeer'
import useSignalingSocket from '../../hooks/useSignalingSocket'

const propTypes = { match: object }

const WatchForm = ({ match }) => {
  const [streamId, setStreamId] = useState(null)
  const [stream, setStream] = useState(null)
  const [id] = useState(uuid())
  const [isConnectedToStream, setIsConnectedToStream] = useState(null)
  const [RDEConn, setRDEConn] = useState(null)

  // RDE
  const [doShowRDControls, setDoShowRDControls] = useState(false)
  const [doShowCloseControls, setDoShowCloseControls] = useState(false)

  const videoRef = useRef(null)
  const videoWithControlsRef = useRef(null)
  const inputRef = useRef(null)

  const [socket, isConnected] = useSignalingSocket('hightly-dev.herokuapp.com', 'viewer', { peerId: id })

  const peer = usePeer(id
  //   , {
  //   host: config.PEER_SERVER_HOST,
  //   port: config.PEER_SERVER_PORT,
  //   path: '/peer'
  // }
  )

  const alert = useAlert()

  // useEffect(() => {
  //   document.addEventListener('keydown', handleUserInput)
  // }, [])

  useEffect(() => {
    if (doShowCloseControls) {
      document.addEventListener('keydown', handleUserInput)
    }
  }, [doShowRDControls])

  useEffect(() => {
    if (isConnectedToStream === true) {
      alert.success('Connected to stream')
    } else if (isConnectedToStream === false) {
      alert.info('Disconnected from stream')
    }
  }, [isConnectedToStream])

  useEffect(() => {
    if (match.params.streamid && socket) {
      socket.emit('checkStreamExistence', match.params.streamid)
    }
  }, [socket, match.params.streamid])

  useEffect(() => {
    if (socket) {
      socket.on('streamExistenceInfo', data => {
        const { active, id } = data

        if (!active) {
          alert.error('This stream does not exist')
        } else {
          setStreamId(id)

          const newUrl = `/watch/${id}`

          window.history.replaceState('watch', 'New stream', newUrl)

          setIsConnectedToStream(true)
        }
      })

      socket.on('disconnectFromStream', () => {
        setStreamId(null)
        setIsConnectedToStream(false)
      })

      if (streamId && peer) {
        socket.emit('offerNewViewer', {
          streamId: streamId,
          viewerId: peer.id
        })

        socket.emit('setProps', {
          to: streamId
        })
      }
    }
  }, [socket, streamId, peer])

  useEffect(() => {
    if (peer) {
      peer.on('call', call => {
        call.answer()

        call.on('stream', stream => {
          setStream(stream)

          const conn = peer.connect(match.params.streamid)

          conn.on('open', () => {
            conn.on('data', data => { console.log(data) })
            setRDEConn(conn)
          })
        })

        call.on('error', error => console.log(error))
      })
    }
  }, [peer])

  useEffect(() => {
    if (RDEConn) {
      // console.log(RDEConn)
      RDEConn.send('лох блядkm')
      console.log('otpravil suka')
    }
  }, [RDEConn])

  // Display steram on a page
  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    if (stream && doShowRDControls) {
      videoWithControlsRef.current.srcObject = stream
    }
  }, [doShowRDControls, videoWithControlsRef, stream])

  const onBtnClick = () => {
    const id = inputRef.current.value.slice(inputRef.current.value.length - 36)

    // TODO: Add some regex
    if (id.length === 36) {
      socket.emit('checkStreamExistence', id)
    } else {
      alert.error('Your link or id is invalid')
    }
  }

  const showCloseControls = e => {
    if (e.key || e.type === 'dblclick') {
      if (e.key === 'Escape' || e.type === 'dblclick') {
        setDoShowCloseControls(true)
        window.setTimeout(() => {
          setDoShowCloseControls(false)
        }, 3000)
      }
    }
  }

  const toggleRDControls = () => {
    setDoShowRDControls(true)
  }

  const handleUserInput = e => {
    if (RDEConn) {
      const defaultMsg = {
        action_type: 'None',
        payload: {
          coords: [0, 0],
          delta_y: 0,
          key: 'k'
        }
      }

      switch (e.type) {
        case 'mousemove':
          const coords = getNaturalCoords()

          let msg = { action_type: 'MouseMove',
            payload: {
              ...defaultMsg.payload,
              coords
            }
          }

          RDEConn.send(JSON.stringify(msg))
          break
      }
    }

    showCloseControls(e)
  }

  return (
    <Layout>
      <Helmet>
        <title>Hightly &#183; Watch</title>
      </Helmet>
      {doShowRDControls
        ? (
          <div
            id='videoWrapper'
            className='video-wrapper'
            // onKeyDown={handleUserInput}
          >
            <video
              id='video'
              ref={videoWithControlsRef}
              className={`${!doShowCloseControls ? 'cursor-none' : ''}`}
              autoPlay='autoplay'
              onDoubleClick={showCloseControls}
              onClick={handleUserInput}
              onKeyDown={handleUserInput}
              onKeyUp={handleUserInput}
              onMouseMove={handleUserInput}
            >
            </video>
            <div id='video1'></div>
            {doShowCloseControls
              ? (
                <a onClick={() => setDoShowRDControls(false)} href='#' id='close' className='float'>
                  <i className='fa fa-times my-float'></i>
                </a>
              )
              : ''
            }
          </div>
        )
        : ''
      }
      {streamId
        ? (
          <Animated>
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
              <button onClick={toggleRDControls} type='button' className='btn btn-outline-primary waves-effect'>
                <i className='fas fa-compress'></i>
              </button>
            </div>
          </Animated>
        )
        : (
          <Animated>
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
          </Animated>
        )
      }
    </Layout>
  )
}

WatchForm.propTypes = propTypes

export default WatchForm
