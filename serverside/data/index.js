const mongoose = require('mongoose')
const  User  = require('./src/models/schemas/user.js')
const  Logs  = require('./src/models/schemas/logs.js')
const  Permissions  = require('./src/models/schemas/permissions.js')

module.exports = {
    User: mongoose.model('User', User),
    Logs: mongoose.model('Logs', Logs),
    Permissions: mongoose.model('Permissions', Permissions),
}