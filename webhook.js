let http = require('http')
let crypto = require('crypto')
let {spawn} = require('child_process')
let SECRET = '123456'
function sign (body) {
  return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex')
}
let server = http.createServer((req, res) => {
  console.log('webhook 🍺')
  if (req.method === 'POST' && req.url == '/webhook') {
    let buffers = []
    req.on('data', function (buffer) {
      buffers.push(buffer)
    })
    req.on('end', function (buffer) {
      let body = Buffer.concat(buffers)
      let event = req.headers['x-github-event']
      let signature = req.headers['x-hub-signature']
      if (signature !== sign(body)) {
        return res.end('not Allowed')
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ok: true}))
      if (event == 'push') {
        let payload = JSON.parse(body);
        let child = spawn('sh', [`./${payload.repository.name}.sh`])
        let buffers = []
        child.stdio.on('data', function(buffer) {
          buffers.push(buffer)
        })
        child.stdio.on('end', function(buffer){
          let log = Buffer.concat(buffers)
          console.log(log)
        })
      }
    })
    
  } else {
    res.end('webhook not found')
  }
})
server.listen(4000, () => {
  console.log('webhook服务器 🍌 4000')
})