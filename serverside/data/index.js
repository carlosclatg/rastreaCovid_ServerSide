const mongoose = require('mongoose')
const  User  = require('./src/models/schemas/user.js')

module.exports = {
    User: mongoose.model('User', User),
}