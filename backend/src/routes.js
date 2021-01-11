import url from 'url'
import UploadHandler from './uploadHandler'
import { logger, pipelineAsync } from './util'

class Routes {
  #io

  constructor(io) {
    this.#io = io
  }

 async options(req, resp) {
   resp.writeHead(204, {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'OPTIONS,POST'
   })
   resp.end()
 } 

  async post(req, resp) {
    const { headers } = req
    const { query: { socketId  }} = url.parse(req.url, true)
    const redirectTo = headers.origin

    const uploadHandler = new UploadHandler(this.#io, socketId)

    const onFinish = (resp, redirectTo) => () => {
      resp.writeHead(303, {
        Connection: 'close',
        Location: `${redirectTo}?msg=Files uploaded with success`
      })

      console.log(`${redirectTo}?msg=Files uploaded with success`)

      resp.end()
    }

    const busboyInstance = uploadHandler.registerEvents(headers, onFinish(resp, redirectTo))

    await pipelineAsync(
      req,
      busboyInstance
    )

    logger.info('request finished with success')
  }

}

export default Routes