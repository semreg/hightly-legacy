const express = require('express')
const ExpressPeerServer = require('peer').ExpressPeerServer

const { PEER_SERVER_PORT: PORT } = require('./config')

const app = express()

const server = app.listen(PORT, () => console.log(`Peer server started on port ${PORT}...`))

const options = {
  debug: false
}

const peerServer = ExpressPeerServer(server, options)

app.use('/peer', peerServer)
