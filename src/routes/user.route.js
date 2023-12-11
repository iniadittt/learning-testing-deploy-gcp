const express = require('express')
const userController = require('../controller/user.controller.js')
const authenticationToken = require('../middleware/authentication.js')
const userRoute = express.Router()

userRoute.post('/auth/register', userController.register)
userRoute.post('/auth/login', userController.login)


// MAU NGAMBIL DATA USER => ID, EMAIL, NAMA
userRoute.get('/users', authenticationToken, userController.getUsers)
userRoute.put('/user', authenticationToken, userController.updateUser)
userRoute.delete('/user/:id', authenticationToken, userController.deleteUser)

module.exports = userRoute