const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catch-async')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    const { name, email, password, repeatedPassword } = req.body
    const newUser = await User.create({
        name, email, password, repeatedPassword
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // Check is email and password exist
    if (!email) return next(new AppError('Please provide an email', 400))
    if (!password) return next(new AppError('Please provide a password', 400))

    // Check if an user exists and a password is correct
    const user = await User.findOne({ email }).select('+password')

    if (!user || !await user.isPasswordCorrect(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // Send token to a client if logged in successfully
    res.status(200).json({
        status: 'success',
        token: signToken(user._id)
    })
})
