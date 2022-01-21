const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    repeatedPassword: {
        type: String,
        required: [true, 'Please repeat your password'],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords are not the same'
        },
        select: false
    }
})

userSchema.pre('save', async function(next) {
    // Call the next middleware if a password hasn't been changed
    if (!this.isModified('password')) return next()
    // Otherwise, encrypt the user password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)
    // Remove the repeated password
    this.repeatedPassword = undefined
})

userSchema.methods.isPasswordCorrect = async function(inputPassword, userPassword) {
    return await bcrypt.compare(inputPassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User
