const { promisify } = require('util')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')
const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catch-async')
const sendEmail = require('../utils/email')
const { unsubscribe } = require('../routes/dish.routes')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const signAndSendNewToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    // Ignore inputted roles as we don't want users to choose their roles
    const { role, rest } = req.body
    const newUser = await User.create(rest)
    signAndSendNewToken(newUser, 201, res)
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
    signAndSendNewToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
    // Get a token and check if it exists
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) return next(new AppError('Access denied. Please log in to get access'))

    // Verify a token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // Check if an user still exists
    const dbUser = await User.findById(decoded.id)
        // It there is not such user in a database
    if (!dbUser) return next(new AppError('The user with the specified token doesn\'t longer exist', 401))

    // Check is an user has changed a password after a token was issued
    if (await dbUser.wasPasswordChangedAfter(decoded.iat)) {
        return next(new AppError('Password was recently changed. Please log in again.'))
    }

    // If user meets all the conditions above, grant access to the protected route
    req.user = dbUser
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not allowed to perform this action', 403))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // Find the user based on a provided email
    const email = req.body.email
    if (!email) return next(new AppError('Please provide an email address'), 400)

    const user = await User.findOne({ email })
    if (!user) return next(new AppError('There is no user with an email: ' + email), 404)

    // Generate the password reset token
    const resetToken = await user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    // Send a token to a client via email
    const resetURL = `${req.protocol}://${req.get('host')}/v1/users/resetPassword/${resetToken}`

    const message = `Forgot your password? Submit a PATCH request with your new password and repeatedPassword to: ${resetURL}\nIf you didn't forget your password, please ignore this email.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to an email!'
        })
    } catch(err) {
        user.createPasswordResetToken = user.passwordResetExpirationTime = undefined
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending the reset password email. Try again later.', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Get an user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({ 
        createPasswordResetToken: hashedToken,
        passwordResetExpirationTime: { $gt: Date.now() }
    })

    console.log(req.body)
    
    // If token hasn't expired and an user exists
    if (!user) return next(new AppError('Token is invalid or has expired', 400))
    user.password = req.body.password
    user.repeatedPassword = req.body.repeatedPassword
    user.passwordResetToken = undefined
    user.passwordResetExpirationTime = undefined
    // Leave validation turned on (we want to check if passwords are correct)
    await user.save()

    signAndSendNewToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get the user (include user's password as it was set not to be visible by default)
    const user = await User.findById(req.user.id).select('+password') 

    // Check if a password provided by the user is correct
    if (!await user.isPasswordCorrect(req.body.providedPassword, user.password)) {
        return next(new AppError('Provided current password is different than the password set to your account', 401))
    }

    // If the user provided correct current password, replace the current
    // user's password with a new one
    user.password = req.body.password
    user.repeatedPassword = req.body.repeatedPassword
    await user.save()

    // Log the user in and send a new token to the user
    signAndSendNewToken(user, 200, res)
})
