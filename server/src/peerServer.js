const express = require('express')
const ExpressPeerServer = require('peer').ExpressPeerServer

const app = express()

const server = app.listen(5002)

const options = {
  debug: true
}

const peerServer = ExpressPeerServer(server, options)

app.use('/peer', peerServer)