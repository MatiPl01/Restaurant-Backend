const express = require('express')
const router = express.Router()

const reviewController = require('../controllers/review.controller')
const authController = require('../controllers/authentication.controller')

// TODO
// router
//   .route('/')
//   .post(
//     authController.protect,
//     orderController.addOrder
//   ).get(
//     authController.protect,
//     orderController.getUserOrders
//   )

module.exports = router
