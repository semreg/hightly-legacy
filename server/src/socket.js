const io = require('./index')

let streams = {}

function socketHandler (socket) {
  socket.on('setRole', role => {
    socket.role = role
  })

  socket.on('createStream', data => { streams[data.streamId] = socket.id })

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
}

module.exports = socketHandler
