let server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // Access-Control-Allow-Origin
  if (req.url === '/api') {
    res.end(JSON.stringify(users))
  } else {
    res.end('not found')
  }
})
server.listen(4000, () => {
  console.log('webhook服务器 🍌 4000')
})