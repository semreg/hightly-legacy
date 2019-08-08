export default {
  URL: process.env.REACT_APP_URL || 'localhost:5000',
  SIGNALING_SERVER_URL: process.env.REACT_APP_SIGNALING_SERVER_URL || 'localhost:5000',
  PEER_SERVER_HOST: process.env.REACT_APP_PEER_SERVER_HOST || 'localhost',
  PEER_SERVER_PORT: process.env.REACT_APP_PEER_SERVER_PORT || 5000
}
