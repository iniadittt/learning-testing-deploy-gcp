const database = require('./database.js')

const connectionToDatabase = async() => {
    try {
        await database.authenticate
        console.log('Database terhubung')
    } catch (error) {
        console.log(`Database gagal terhubung, error: ${error.message}`)
    }
}

module.exports = connectionToDatabase