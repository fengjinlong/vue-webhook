let http = require('http')
let crypto = require('crypto')
let {spawn} = require('child_process')
// let sendMail = require('./sendMail')
// const nodemailer = require("nodemailer");
// const mailTransport = nodemailer.createTransport({
//   host : 'smtp.sina.com',
//   secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
//   auth : {
//       user : '469508377@qq.com', //发送邮件的邮箱
//       pass : 'xxxxxxxxxxxx' //第三方授权密码，POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务
//   },
// });


// main().catch(console.error);
let SECRET = '123456'
function sign (body) {
  return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex')
}
let server = http.createServer((req, res) => {
  console.log('webhook 🍺')
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
      // if (signature !== sign(body)) {
      //   console.log('111222')
      //   return res.end('not Allowed')
      // }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ok: true}))
      if (event == 'push') {
        let payload = JSON.parse(body);
        console.log('项目部署---->')
        console.log(payload.repository.name)
        let child = spawn('sh', [`./${payload.repository.name}.sh`])
        let buffers = []
        child.stdout.on('data', function(buffer) {
          buffers.push(buffer)
        })
        child.stdout.on('end', function(buffer){
          let log = Buffer.concat(buffers).toString()
          console.log(log)
          main()
          // sendMail(`
          //   <h1>部署日期：${new Date()}</h1>
          //   <h1>部署人：${payload.pusher.name}</h1>
          //   <h2>部署邮箱：${payload.pusher.email}</h2>
          //   <h2>提交信息：${payload.head_commit}</h2>
          //   <h2>部署日志：${log.replace("\r\n", '<br/>')}</h2>
          // `);
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