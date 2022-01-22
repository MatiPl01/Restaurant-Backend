const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: ['client', 'manager', 'admin'],
        default: 'client'
    },
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
    },
    passwordChangedDate: Date,
    passwordResetToken: String,
    passwordResetExpirationTime: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    banned: {
        type: Boolean,
        default: false
    },
    basket: [
        {
            dish: {
                type: mongoose.Schema.ObjectId,
                ref: 'Dish',
            },
            quantity: {
                type: Number,
                required: [true, 'Please provide a dish quantity'],
                min: 1
            }
        }
    ],
    orders: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Order'
        }
    ]
})

userSchema.pre('save', async function(next) {
    // Call the next middleware if a password hasn't been changed
    if (!this.isModified('password')) return next()
    // Otherwise, encrypt the user password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)
    // Remove the repeated password
    this.repeatedPassword = undefined
    
    next()
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next()
    
    this.passwordChangedDate = Date.now() - 1000
    next()
})

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } })
    next()
})

userSchema.methods.isPasswordCorrect = async function(inputPassword, userPassword) {
    return await bcrypt.compare(inputPassword, userPassword)
}

userSchema.methods.wasPasswordChangedAfter = async function (timestamp) {
    if (this.passwordChangedDate) {
        const changedTimestamp = parseInt(this.passwordChangedDate.getTime() / 1000, 10)
        return changedTimestamp > timestamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Hash the reset token
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    console.log({resetToken}, this.passwordResetToken)

    this.passwordResetExpirationTime = Date.now() + 10 * 60 * 1000 // Make the token valid for 10 minutes

    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
