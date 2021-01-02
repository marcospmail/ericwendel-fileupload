import http from 'http'
import { Server } from 'socket.io'
import Routes from './routes'

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

io.on('connection', (socket) => console.log('someone connected', socket.id))

// setInterval(() => {
//   io.emit('file-uploaded', 500)
// }, 10)

server.listen(PORT, () => console.log(`app running at port ${PORT}`))