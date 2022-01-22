const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller')
const authController = require('../controllers/authentication.controller')

router.post(
  '/signup', 
  authController.signUp
)

router.post(
  '/login', 
  authController.login
)

router.post(
  '/forgotPassword', 
  authController.forgotPassword
)

router.patch(
  '/resetPassword/:token', 
  authController.resetPassword
)

router.post(
  '/updatePassword', 
  authController.protect, 
  authController.updatePassword
)

router
  .route('/basket')
  .get(
    authController.protect, 
    userController.getBasket
  ).patch(
    authController.protect, 
    userController.updateBasket
  )

router
  .route('/')
  .get(
    authController.protect, 
    authController.restrictTo('admin'),
    userController.getAllUsers
  ).post(
    userController.addUser
  ).delete(
    authController.protect,
    authController.restrictTo('client'),
    userController.deleteCurrentUser
  )

router
  .route('/:id/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  ).patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  ).delete(
    authController.protect,
    authController.restrictTo('admin'), 
    userController.deleteUser
  )

module.exports = router
