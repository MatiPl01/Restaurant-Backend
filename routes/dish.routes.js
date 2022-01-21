const express = require('express')
const router = express.Router()

const dishController = require('../controllers/dish.controller')
const authController = require('../controllers/authentication.controller')

router
  .route('/')
  .get(dishController.getAllDishes)
  .post(
    authController.protect, 
    authController.restrictTo('manager', 'admin'),
    dishController.addDish
  )

router
  .route('/:id/')
  .get(dishController.getDish)
  .patch(
    authController.protect, 
    authController.restrictTo('client', 'manager', 'admin'),
    dishController.updateDish
  ).delete(
    authController.protect, 
    authController.restrictTo('manager', 'admin'),
    dishController.deleteDish
  )

module.exports = router
