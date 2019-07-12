const app = require('http').createServer()
const io = require('socket.io')(app, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': req.headers.origin, //or the specific origin you want$
      'Access-Control-Allow-Credentials': true
    }

    res.writeHead(200, headers)
    res.end()
  }
})


const { SIGNALING_SERVER_PORT: PORT } = require('./config')

let streams = {}

io.on('connection', socket => {
  socket.on('setRole', role => {
    socket.role = role
  })

  socket.on('createStream', data => { streams[data.streamId] = socket.id })

  socket.on('offerNewViewer', data => {
    if (streams[data.streamId]) {
      const viewerId = data.viewerId

      io.to(streams[data.streamId]).emit('addNewViewer', viewerId)
    }
  })

  socket.on('setViewerProps', viewerProps => {
    if (socket.role === 'viewer') {
      socket.viewerProps = viewerProps
    }
  })

  socket.on('disconnect', () => {
    switch (socket.role) {
      case 'streamer': {
        if (Object.values(streams).includes(socket.id)) {
          delete streams[Object.keys(streams).find(key => streams[key] === socket.id)]
        }

        break
      }

      case 'viewer': {
        if (socket.viewerProps) {
          const { to, viewerId } = socket.viewerProps

          const streamerSocketId = streams[to]

          if (streamerSocketId) {
            io.to(streams[to]).emit('removeViewer', viewerId)
          }
        }

        break
      }
    }
  })
})

app.listen(PORT, console.log(`Signaling server started on port ${PORT}...`))
