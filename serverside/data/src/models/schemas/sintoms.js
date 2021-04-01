const { Schema } = require('mongoose')

const Sintoms = new Schema({
    sintom: {
        type: String,
        required: true
    },

    sintomDescription: {
        type: String,
        required: true
    }

})

module.exports = Sintoms