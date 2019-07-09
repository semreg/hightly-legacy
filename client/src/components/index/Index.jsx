import React from 'react'
import Layout from '../layouts/Layout'
import Animated from '../other/Animated'
import { Link } from 'react-router-dom'
import './index.scss'

const Index = () => (
  <Layout>
    <Animated>
      <div className='jumbotron text-center'>
        <h2 className='card-title h2'>Open Source Screen Share Web App</h2>
        <p className='blue-text my-4 font-weight-bold'>Free and intuitive to use</p>
        <div className='row d-flex justify-content-center'>
          <div className='col-xl-7 pb-2'>
            <p className='card-text'>Based on WebRTC technology and websockets, the app creates peer-to-peer connection between streamer and watcher browser</p>
          </div>
        </div>
        <hr className='my-4' />
        <div className='pt-2'>
          <Link to='stream' type='button' className='btn btn-blue waves-effect aqua-gradient btn-round'>Start Stream <span className='fas fa-broadcast-tower ml-1'></span></Link>
          <Link to='watch' type='button' className='btn waves-effect purple-gradient btn-round'>Watch Another Stream <i className='fas fa-eye ml-1'></i></Link>
        </div>
      </div>
    </Animated>
  </Layout>
)

export default Index
