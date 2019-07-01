import React from 'react'
import Layout from '../layouts/Layout'
import Animated from '../other/Animated'
import { Link } from 'react-router-dom'

export default function Index () {
  return (
  <Layout>
    <Animated>
    <div className="jumbotron text-center">
      <h2 className="card-title h2">Open Source Screen Share Web App</h2>
      <p className="blue-text my-4 font-weight-bold">Free and intuitive to use</p>
      <div className="row d-flex justify-content-center">
        <div className="col-xl-7 pb-2">
          <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga aliquid dolorem ea distinctio exercitationem delectus qui, quas eum architecto, amet quasi accusantium, fugit consequatur ducimus obcaecati numquam molestias hic itaque accusantium doloremque laudantium, totam rem aperiam.</p>
        </div>
      </div>
      <hr className="my-4" />
      <div className="pt-2">
        <Link to='stream' type="button" className="btn btn-blue waves-effect aqua-gradient btn-round">Start Stream <span className="fas fa-broadcast-tower ml-1"></span></Link>
        <Link to='watch' type="button" className="btn waves-effect purple-gradient btn-round">Watch Another Stream <i className="fas fa-eye ml-1"></i></Link>
      </div>
    </div>
    </Animated>
  </Layout>
  )
}
