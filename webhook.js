let http = require('http')
let server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // Access-Control-Allow-Origin
  if (req.method === 'POST' && req.url == '/webhook') {
    // res.end(JSON.stringify(users))

  } else {
    res.end('webhook not found')
  }
})
server.listen(4000, () => {
  console.log('webhook服务器 🍌 4000')
})