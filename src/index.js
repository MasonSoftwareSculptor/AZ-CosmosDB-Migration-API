const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')

const router = require('./apis')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(compression())

const serverHost = process.env.HOST
const serverPort = process.env.PORT

app.use('/api', router)

app.listen(serverPort, serverHost, () => {
  console.log(`App is listening on http://${serverHost}:${serverPort}`)
})
