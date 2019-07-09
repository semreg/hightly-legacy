const express = require('express')
const path = require('path')

const app = express()

const { MAIN_SERVER_PORT: PORT } = require('./config')

app.use(express.static(path.join(__dirname, '/../../client/build')))

app.use('*', (req, res) => res.sendFile(path.join(__dirname, '/../../client/build/index.html')))

app.listen(PORT, () => console.log(`Main server started on port ${PORT}...`))
