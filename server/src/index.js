const express = require('express')
const http = require('http')
const path = require('path')
const ExpressPeerServer = require('peer').ExpressPeerServer
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = socketIo(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true
    }

    res.writeHead(200, headers)
    res.end()
  }
})

let streams = {}

io.on('connection', socket => {
  socket.on('setRole', role => {
    socket.role = role
  })

  socket.on('setProps', props => {
    const currentProps = socket.props

    socket.props = {
      ...currentProps,
      ...props
    }
  })

  socket.on('createStream', data => {
    streams[data.streamId] = {
      streamerSocket: socket.id,
      viewers: {}
    }

    // console.log(JSON.stringify(streams, null, 4))
  })

  socket.on('checkStreamExistence', id => {
    if (streams[id]) {
      socket.emit('streamExistenceInfo', { active: true, id })
    } else {
      socket.emit('streamExistenceInfo', { active: false, id })
    }
  })

  socket.on('offerNewViewer', data => {
    if (streams[data.streamId]) {
      const viewerId = data.viewerId

      streams[data.streamId].viewers[data.viewerId] = socket.id

      io.to(streams[data.streamId].streamerSocket).emit('addNewViewer', viewerId)
    }

    // console.log(streams)
  })

  socket.on('disconnect', () => {
    switch (socket.role) {
      case 'streamer': {
        const stream = streams[socket.props.peerId]

        if (stream) {
          for (const id in stream.viewers) {
            io.to(stream.viewers[id]).emit('disconnectFromStream')

            delete streams[socket.props.peerId].viewers[id]
          }

          delete streams[socket.props.peerId]
        }

        break
      }

      case 'viewer': {
        if (socket.props) {
          const { to, peerId } = socket.props

          const stream = streams[to]

          if (stream) {
            delete streams[to].viewers[peerId]

            io.to(streams[to].streamerSocket).emit('removeViewer', peerId)
          }
        }

        break
      }
    }
  })
})

const peerServerOptions = {
  debug: false
}

const peerServer = ExpressPeerServer(server, peerServerOptions)

app.use(express.static(path.join(__dirname, '/../../client/build')))
app.use('*', (req, res) => res.sendFile(path.join(__dirname, '/../../client/build/index.html')))
app.use('/peer', peerServer)

server.listen(5000, () => console.log('Started'))
