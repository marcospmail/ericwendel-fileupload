import Busboy from 'busboy'
import { logger, pipelineAsync } from './util'
import { createWriteStream } from 'fs'
import { join, resolve } from 'path'

const FILE_UPLOAD_EVENT = 'file-uploaded'

class UploadHandler {
  #io
  #socketId

  constructor(io, socketId) {
    this.#io = io
    this.#socketId = socketId
  }

  registerEvents(headers, onFinish) {
    const busboy = new Busboy({ headers })

    busboy.on('file', this.#onFile.bind(this))

    busboy.on('finish', onFinish)

    return busboy
  }

  handleFileBytes(filename) {

    async function* handleData(data) {
      for await (const item of data) {
        const size = item.length
        logger.info(`File ${filename} got ${size} from ${this.#socketId}`)
        this.#io.to(this.#socketId).emit(FILE_UPLOAD_EVENT, size)
        yield item
      }
    }

    return handleData.bind(this)
  }

  async #onFile(fieldname, file, filename) {
    const __dirname = resolve()
    const saveFileTo = join(__dirname, 'downloads', filename)

    logger.info('uploading ' + saveFileTo)

    await pipelineAsync(
      file,
      this.handleFileBytes.apply(this, [filename]),
      createWriteStream(saveFileTo)
    )

    logger.info('file' + filename + ' finished')
  }

}

export default UploadHandler