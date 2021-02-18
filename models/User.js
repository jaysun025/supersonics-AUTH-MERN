const mongoose = require('../db/connection')

const options = {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_doc, userDocToReturn) => {
            delete userDocToReturn.password
            return userDocToReturn
        }
    }
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    motto: String
}, options)

module.exports = mongoose.model('User', userSchema)