const express = require('express')
const router = express.Router()

const orderController = require('../controllers/order.controller')
const authController = require('../controllers/authentication.controller')

router
  .route('/')
  .post(
    authController.protect,
    orderController.addOrder
  ).get(
    authController.protect,
    orderController.getUserOrders
  )

router
  .route('/:id/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.getOrder
  )

module.exports = router
