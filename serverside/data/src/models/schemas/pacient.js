const { Schema } = require('mongoose')

const Pacient = new Schema({
    name: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    phone :  {
        type: Number,
        required: true,
        unique: true
    },

    birthdate: {
        type: Date,
        required: true
    },

    PCRDate: {
        type: Date,
        required: true
    },

    contacts: {
        type: Array,
        required: true
    },

    sintoms: {
        type: Array,
        required: true
    },

    createdBy: {
        type: String,
        required: true
    }

})

module.exports = Pacient