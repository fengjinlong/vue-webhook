let http = require('http')
let crypto = require('crypto')
let SECRET = '123456'
function sign (body) {
  return `sha1=` + CaretPosition.creatHmac('sha1', SECRET).update(body).digest('hex')
}
let server = http.createServer((req, res) => {
  console.log('webhook 🍺')
  if (req.method === 'POST' && req.url == '/webhook') {
    let buffers = []
    req.on('data', function (buffer) {
      buffers.push(buffer)
    })
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ok: true}))
  } else {
    res.end('webhook not found')
  }
})
server.listen(4000, () => {
  console.log('webhook服务器 🍌 4000')
})