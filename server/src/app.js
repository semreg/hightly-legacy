const app = require('http').createServer()
const io = require('socket.io')(app)

app.listen(3002)

// let users = {}

let streams = {

}

io.on('connection', socket => {
  // socket.on('room', msg => {
  //   const json = JSON.parse(msg)
    
  //   users[json.id] = socket

  //   if (socket.room !== undefined) {
  //     socket.leave(socket.room)
  //   }

  //   socket.room = json.room
  //   socket.join(socket.room)
  //   socket.user_id = json.id

  //   socket.broadcast.to(socket.room).emit('new', json.id)
  // })

  // socket.on('webrtc', msg => {
  //   const json = JSON.parse(msg)

  //   if (json.to !== undefined && users[json.to] !== undefined) {
  //     users[json.to].emit('webrtc', msg)
  //   } else {
  //     socket.broadcast.to(socket.room).emit('webrtc', message)
  //   }
  // })

  // socket.on('disconnect', () => {
  //   socket.broadcast.to(socket.room).emit('leave', socket.user_id)
  //   delete users[socket.user_id]
  // })
  socket.on('newstreamer', msg => {
    console.log(`New stremer: ${msg}`)
  })

  socket.on('newwatcher', msg => {
    console.log(msg)
  })
})