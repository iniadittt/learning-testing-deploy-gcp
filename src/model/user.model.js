const { Sequelize, DataTypes } = require('sequelize')
const database = require('../config/database.js')


const TableUser = database.define('user', {
    id: {
        type: DataTypes.STRING, // VARCHAR 255
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    }
}, {})

module.exports = TableUser