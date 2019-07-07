import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Index from './index/Index'
import StreamForm from './stream/StreamForm'
import WatchForm from './watch/WatchForm'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from '../javascripts/alert-template'
import './app.scss'

function App () {
  const options = {
    position: positions.BOTTOM_RIGHT,
    timeout: 2000,
    offset: '30px',
    transition: transitions.SCALE
}

  return (
    <Router>
      <AlertProvider template={AlertTemplate} {...options}>
        <Switch>
          <Route exact path='/watch/' component={WatchForm} />
          <Route path='/watch/:streamid' component={WatchForm} />
          <Route path='/stream' component={StreamForm} />
          <Route path='/'component={Index} />
        </Switch>
      </AlertProvider>
    </Router>
  )
}

export default App
