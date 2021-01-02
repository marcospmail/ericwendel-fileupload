import url from 'url'

class Routes {
  #io

  constructor(io) {
    this.#io = io
  }

  async post(req, resp) {
    const { headers } = req

    const { query: { socketId  }} = url.parse(req.url, true)

    this.#io.to(socketId).emit('file-uploaded', 500)
    this.#io.to(socketId).emit('file-uploaded', 500)
    this.#io.to(socketId).emit('file-uploaded', 500)
    this.#io.to(socketId).emit('file-uploaded', 500)

    const onFinish = (resp, redirectTo) => {
      resp.writeHead(303, {
        Connection: 'close',
        Location: `${redirectTo}?msg=Files uploaded with success`
      })

      console.log(`${redirectTo}?msg=Files uploaded with success`)

      resp.end()
    }

    onFinish(resp, headers.origin)
  }

}

export default Routes