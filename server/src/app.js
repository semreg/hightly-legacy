const app = require('http').createServer()
const io = require('socket.io')(app)

app.listen(3002)

// let users = {}

let streams = {

}

io.on('connection', socket => {
  socket.on('createstream', data => {
    
  })

  socket.on('newwatcher', msg => {
    console.log(msg)
  })
})