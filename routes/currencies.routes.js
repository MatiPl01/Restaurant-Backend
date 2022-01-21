const express = require('express')
const router = express.Router()

const currenciesController = require('../controllers/currencies.controller')

router
  .route('/')
  .get(currenciesController.getCurrencies)

module.exports = router
