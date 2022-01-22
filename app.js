const express = require('express')
const morgan = require('morgan')
const bp = require('body-parser')

const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')

require('./db/db-connect')

const dishRouter = require('./routes/dish.routes')
const currenciesRouter = require('./routes/currencies.routes')
const usersRouter = require('./routes/user.routes')
const ordersRouter = require('./routes/order.routes')
const reviewsRouter = require('./routes/review.routes')

const AppError = require('./utils/app-error')
const errorController = require('./controllers/error.controller')

const app = express()

// GLOBAL MIDDLEWARES
// Security middleware
app.use(helmet())

// Cors middleware
app.use(cors())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Json body parser
app.use(bp.json())

// Url data parser
app.use(bp.urlencoded({ extended: true }))

// Development output messages
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Middleware saving current time
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

// Routes
app.use('/v1/dishes', dishRouter)
app.use('/v1/currencies', currenciesRouter)
app.use('/v1/users', usersRouter)
app.use('/v1/orders', ordersRouter)
app.use('/v1/reviews', reviewsRouter)

// Error handling middleware
app.use(errorController)

// Error handling route
app.all('*', (req, res, next) => {
    next(new AppError(`${req.originalUrl} url is not specified on this server`, 404))
})

module.exports = app
