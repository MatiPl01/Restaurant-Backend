const catchAsync = require('../utils/catch-async')
const Order = require('../models/order.model')
const User = require('../models/user.model')

exports.getOrder = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const order = await Order.findById(id)

    if (!order) return next(new AppError(`Cannot find an order with ID ${id}`))

    res.status(200).json({
        status: 'success',
        data: order
    })
})

exports.addOrder = catchAsync(async (req, res, next) => {
    const newOrder = await Order.create(req.body)
    const user = await User.findById(req.user.id)
    user.orders.push(addOrder._id)

    res.status(201).json({
        status: 'success',
        data: newOrder
    })
})

exports.getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await User.findById(req.user.id).populate({
        path: 'orders'
    })
  
    res.status(201).json({
        status: 'success',
        data: orders
    })
})
