const catchAsync = require('../utils/catch-async')
const User = require('../models/user.model')

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        count: users.length,
        data: {
            users
        } 
    })
})

exports.getUser = catchAsync(async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
})

exports.addUser = catchAsync(async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
})

exports.updateUser = catchAsync(async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
})

exports.deleteUser = catchAsync(async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
})
