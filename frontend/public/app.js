let bytesAmount = 0

const API_URL = 'http://localhost:3000'
const FILE_UPLOADED_EVENT = 'file-uploaded'

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  )
}

const updateStatus = (size) => {
  const formattedBytes = formatBytes(size)
  const text = `Pending Bytes to Upload: <strong>${formattedBytes}</strong>`
  document.getElementById('size').innerHTML = text
}

const showSize = () => {
  const { files: fileElements } = document.getElementById('file')
  if (!fileElements.length) return;

  const files = Array.from(fileElements)
  const size = files.reduce((prev, next) => prev + next.size, 0)

  bytesAmount = size
  updateStatus(size)
}

const showMessage = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const msgParam = urlParams.get('msg')

  if (!msgParam) return

  const msg = document.querySelector('#msg')
  msg.innerText = msgParam

  msg.classList.add('alert', 'alert-success')

  setTimeout(() => {
    msg.hidden = true
  }, 3000)
}

const updateFormAction = (targetUrl) => {
  const form = document.querySelector('#form')
  form.action = targetUrl
}

const onload = () => {
  showMessage()

  const ioClient = io.connect(API_URL, { withCredentials: false })
  ioClient.on('connect', () => {
    console.log(`connected ${ioClient.id}`)
    const formAction = `${API_URL}/upload?socketId=${ioClient.id}`
    updateFormAction(formAction)
  })

  ioClient.on(FILE_UPLOADED_EVENT, (bytesReceived) => {
    console.log('received', bytesReceived)

    if (bytesAmount > 0) {
      bytesAmount = bytesAmount - bytesReceived
      updateStatus(bytesAmount)
    }
  })
}

window.onload = onload
window.showSize = showSize