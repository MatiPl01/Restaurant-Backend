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

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
    
    res.status(200).json({
        status: 'success',
        data: { user } 
    })
})

exports.addUser = catchAsync(async (req, res) => {
    const newUser = await User.create(req.body)

    res.status(201).json({
        status: 'success',
        data: newUser
    })
})

// A function below will be used by admin to set users roles and manage bans
exports.updateUser = catchAsync(async (req, res) => {
    const id = req.params.id

    const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })

    if (!user) return next(new AppError(`Cannot find an user with ID ${id}`))

    res.status(200).json({
        status: 'success',
        data: user
    })
})

exports.deleteUser = catchAsync(async (req, res) => {
    const id = req.params.id
    const user = await User.findByIdAndDelete(id)

    if (!user) return next(new AppError(`Cannot find an user with ID ${id}`))

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.updateBasket = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: user.basket
    })
})

exports.getBasket = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        status: 'success',
        data: user.basket
    })
})
