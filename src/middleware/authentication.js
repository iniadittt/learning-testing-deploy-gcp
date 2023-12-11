const jwt = require('jsonwebtoken')

const authenticationToken = async(req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(400).json({ message: 'Token invalid' })
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.SECRET_KEY, (error, data) => {
        if (error) return res.status(400).json({ message: 'Token invalid' })
        req.email = data.email
        next()
    })
}

module.exports = authenticationToken