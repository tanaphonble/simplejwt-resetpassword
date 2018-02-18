// POC reset password

const jwt = require('jwt-simple')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

const payload = { pl: 'testing' }
const secret = 'RKyxR9humnm1mJ8ekRzYF1VrXv3Hkx8iXZ1ihOvSh8U='
const tokenWithSecet = jwt.encode(payload, secret)

console.log('token with secret', tokenWithSecet)

const decode = jwt.decode(tokenWithSecet, secret)
console.log('decode with secret', decode)

// routes
app.get('/status', function (req, res) {
  res.send({ status: 'running' })
})

app.get('/forgotpassword', function (req, res) {
  res.sendFile(path.join(__dirname, '/forgotpassword.html'))
})

// encoding
app.post('/passwordreset', function (req, res) {
  const { email } = req.body
  if (email) {
    // user = model.User.findOne by email
    // then return user
    const payload = {
      id: 1111,
      email
    }
    // secret from hash of old password and create date 
    const secret = '9humrXv3Hkxnm1mJ8ekRz'
    const token = jwt.encode(payload, secret)

    const responseForm = `<a href="/resetpassword/${payload.id}/${token}">Reset Password</a>`
    res.send(responseForm)
  } else {
    res.send(`:(`)
  }
})

// decoding
app.get('/resetpassword/:id/:token', function (req, res) {
  const { id, token } = req.params
  console.log('parameters id', id, 'token', token)
  // user = model.User.findOne by id
  // the same secret as secret string in route: /passwordreset
  // secret from hash of old password and create date 
  const secret = '9humrXv3Hkxnm1mJ8ekRz'
  const payload = jwt.decode(token, secret)
  console.log('payload from resetpassword', payload)
  res.send('<form action="/resetpassword" method="POST">' +
    '<input type="hidden" name="id" value="' + payload.id + '" />' +
    '<input type="hidden" name="token" value="' + req.params.token + '" />' +
    '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
    '<input type="submit" value="Reset Password" />' +
    '</form>')
})

app.post('/resetpassword', function (req, res) {
  // secret from hash of old password and create date 
  // user = model.User.findOne by id
  const secret = '9humrXv3Hkxnm1mJ8ekRz'

  const { token } = req.body
  const payload = jwt.decode(token, secret)
  res.send('Your password has been chaged')
})

app.listen(4000, function () {
  console.log('app is running on port 4000')
})
