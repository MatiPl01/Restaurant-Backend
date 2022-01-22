const AppError = require('../utils/app-error')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    const message = `Duplicate field value: ${value}. Please use another value`
    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401)

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401)

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    // Operational error, send message to the user
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

    // Programming or unknown error, don't leak details to the user
    } else {
        // Show error in a console
        console.error('❌ Error:', err)

        // Send a generic message to the user
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    console.log('>> NEW ERROR', err.message)
    
    if (!err.statusCode) err.statusCode = 500
    if (!err.status) err.status = 'error'

    if (process.env.NODE_ENV === 'development') sendErrorDev(err, res)
    else if (process.env.NODE_ENV === 'production') {
        let resErr = err

        console.log('resErr MESS', resErr.message)

        if (err.name === 'CastError') resErr = handleCastErrorDB(resErr)
        else if (err.code === 11000) resErr = handleDuplicateFieldsDB(resErr)
        else if (err.name === 'ValidationError') resErr = handleValidationErrorDB(resErr)
        else if (err.name === 'JsonWebTokenError') resErr = handleJWTError()
        else if (err.name === 'TokenExpiredError') resErr = handleJWTExpiredError()

        sendErrorProd(resErr, res)
    }
}
