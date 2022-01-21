const express = require('express')
const { getAllUsers, addUser, getUser, updateUser, deleteUser } = require('../controllers/user.controller')
const { signUp, login } = require('../controllers/authentication.controller')
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)

router
  .route('/')
  .get(getAllUsers)
  .post(addUser)

router
  .route('/:id/')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

module.exports = router
