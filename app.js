const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('./db/db-connect')
const bp = require('body-parser')

const dishRouter = require('./routes/dish.routes')
const currenciesRouter = require('./routes/currencies.routes')
const usersRouter = require('./routes/user.routes')

const AppError = require('./utils/app-error')
const errorController = require('./controllers/error.controller')

const app = express()

// Cors middleware
app.use(cors())

// Others middlewares
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

// Routes
app.use('/v1/dishes', dishRouter)
app.use('/v1/currencies', currenciesRouter)
app.use('/v1/users', usersRouter)

// Error handling middleware
app.use(errorController)

// Error handling route
app.all('*', (req, res, next) => {
    next(new AppError(`${req.originalUrl} url is not specified on this server`, 404))
})

module.exports = app
