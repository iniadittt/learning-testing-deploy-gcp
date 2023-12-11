const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const connectionToDatabase = require('./config/connection.js')
const TableUser = require('./model/user.model.js')
const userRoute = require('./routes/user.route.js')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

TableUser.sync({ force: false })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(userRoute)
app.get('/', (req, res) => res.send('Hello World!'))
app.all('*', (req, res) => res.send('Hello World!'))

app.listen(PORT, async() => {
    await connectionToDatabase()
    console.log(`Server berjalan di port : ${PORT}`)
})