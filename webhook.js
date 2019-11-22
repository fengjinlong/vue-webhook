let http = require('http')
let crypto = require('crypto')
let {spawn} = require('child_process')
let SECRET = '123456'
function sign (body) {
  return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex')
}
let server = http.createServer((req, res) => {
  console.log('webhook 🍺')
  // console.log(req)
  if (req.method == 'POST' && req.url == '/webhook') {
    let buffers = []
    console.log('111')
    req.on('data', function (buffer) {
      buffers.push(buffer)
    })
    req.on('end', function (buffer) {
      let body = Buffer.concat(buffers)
      let event = req.headers['x-github-event']
      let signature = req.headers['x-hub-signature']
      console.log('11133')
      console.log(signature)
      console.log(sign(body))
      if (signature !== sign(body)) {
        console.log('111222')
        return res.end('not Allowed')
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ok: true}))
      console.log(1)
      if (event == 'push') {
        let payload = JSON.parse(body);
        console.log('payload.repository.name')
        console.log(payload.repository.name)
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