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

router.delete(
  '/delete',
  authController.protect,
  userController.deleteCurrentUser
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
  .route('/')
  .get(
    authController.protect, 
    authController.restrictTo('admin'),
    userController.getAllUsers
  ).post(userController.addUser)

router
  .route('/:id/')
  .get(
    authController.protect,
    authController.restrictTo('client', 'admin'),
    userController.getUser
  ).patch(
    authController.protect,
    authController.restrictTo('client', 'admin'),
    userController.updateUser
  ).delete(
    authController.protect,
    authController.restrictTo('admin'), 
    userController.deleteUser
  )

module.exports = router
