import http from 'http'
import { Server } from 'socket.io'
import Routes from './routes'
import { logger } from './util'

const PORT = 3000

const handler = (req, res) => {
  const defaultRoute = async (req, res) => res.end('hello!')

  const routes = new Routes(io)
  const chosen = routes[req.method.toLowerCase()] || defaultRoute

  chosen.apply(routes, [req, res])    
}

const server = http.createServer(handler)
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: false
  }
})

io.on('connection', (socket) => logger.info('someone connected' + socket.id))

// setInterval(() => {
//   io.emit('file-uploaded', 500)
// }, 10)

server.listen(PORT, () => logger.info(`app running at port ${PORT}`))