const bcrypt = require('bcrypt')
const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')
const TableUser = require('../model/user.model.js')
const jwt = require('jsonwebtoken')

const register = async(req, res) => {
    try {
        const { email, password, confirmPassword } = req.body
        if (!email || !password || !confirmPassword) return res.status(400).json({ message: 'Email, password, confirm password dibutuhkan' })
        if (password !== confirmPassword) return res.status(400).json({ message: 'Password dan confirm password tidak sesuai' })
        const emailValidation = Joi.string().email().required()
        const isEmail = await emailValidation.validateAsync(email)
        if (!isEmail) return res.status(400).json({ message: 'Email tidak valid' })
        const searchUserInDatabase = await TableUser.count({ where: { email } })
        if (searchUserInDatabase > 0) return res.status(400).json({ message: 'Email sudah terdaftar' })
        const hashingPassword = await bcrypt.hash(password, 10)
        const createdUser = await TableUser.create({
            id: uuidv4(),
            email,
            password: hashingPassword
        })
        if (!createdUser) return res.status(400).json({ message: 'Register gagal' })
        return res.status(200).json({ message: 'Register berhasil' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

const login = async(req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'Email dan password dibutuhkan' })
        const emailValidation = Joi.string().email().required()
        const isEmail = await emailValidation.validateAsync(email)
        if (!isEmail) return res.status(400).json({ message: 'Email tidak valid' })
        const searchUserInDatabase = await TableUser.findOne({ where: { email } })
        if (!searchUserInDatabase) return res.status(400).json({ message: 'Email dan password salah' })
        const matchPassword = await bcrypt.compare(password, searchUserInDatabase.dataValues.password)
        if (!matchPassword) return res.status(400).json({ message: 'Email dan password salah' })
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' })
        return res.status(200).json({ message: 'Login berhasil', data: { token } })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

const getUsers = async(req, res) => {
    try {
        const users = await TableUser.findAll({ attributes: ['id', 'email', 'nama'] })
        if (users.length === 0) return res.status(400).json({ message: 'Data users not found' })
        return res.status(200).json({ message: 'Berhasil get data users', data: users })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

const updateUser = async(req, res) => {
    try {
        const myEmail = req.email
        const nama = req.body.nama
        const searchUserInDatabase = await TableUser.findOne({ where: { email: myEmail } })
        if (!searchUserInDatabase) return res.status(400).json({ message: 'User not found' })
        searchUserInDatabase.nama = nama || searchUserInDatabase.dataValues.nama
        const updateUser = searchUserInDatabase.save()
        if (!updateUser) return res.status(400).json({ message: 'Update user gagal' })
        return res.status(200).json({ message: 'Berhasil update user' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

const deleteUser = async(req, res) => {
    try {
        const id = req.params.id
        const myEmail = req.email
        const searchUserInDatabase = await TableUser.findOne({ where: { email: myEmail } })
        if (!searchUserInDatabase) return res.status(400).json({ message: 'User not found' })
        const deleteUser = await TableUser.destroy({ where: { email: myEmail, id } })
        if (!deleteUser) return res.status(400).json({ message: 'Delete user gagal' })
        return res.status(200).json({ message: 'Berhasil delete user' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

module.exports = {
    register,
    login,
    getUsers,
    updateUser,
    deleteUser
}