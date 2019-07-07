const app = require('http').createServer()
const io = require('socket.io')(app)

let streams = {}

app.listen(5001)

// const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value)

if (process.env.NODE_ENV === 'development') {
  io.use((socket, next) => {
    console.log(`\nCurrent streams: ${JSON.stringify(streams, null, 2)}\n`)
  
    next()
  })
}

io.on('connection', socket => {
  socket.on('setRole', role => {
    socket.role = role
  })

  socket.on('createStream', data => { streams[data.streamId] = socket.id })

  socket.on('offerNewWatcher', data => {
    if (streams[data.streamId])  {
      io.to(streams[data.streamId]).emit('addNewWatcher', { watcherId: data.watcherId })
    }
  })

  socket.on('setWatcherProps', watcherProps => {
    if (socket.role === 'watcher') {
      socket.watcherProps = watcherProps
    }
  })

  socket.on('disconnect', () => {
    switch(socket.role) {
      case 'streamer': {
        if (Object.values(streams).includes(socket.id)) {
          delete streams[Object.keys(streams).find(key => streams[key] === socket.id)]
        }

        break
      }

      case 'watcher': {
        if (socket.watcherProps) {
          // console.log(socket.watcherProps)
          const { to, watcherId } = socket.watcherProps

          const streamerSocketID = streams[to]
          
          if (streamerSocketID) {
            io.to(streams[to]).emit('removeWatcher', watcherId )
          }
        }
        
        break
      }
    }
  })
})
