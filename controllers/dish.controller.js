const { ObjectId } = require("mongodb")
const Dish = require("../models/dish.model")
const AppError = require("../utils/app-error")
const catchAsync = require('../utils/catch-async')

exports.getAllDishes = catchAsync(async (req, res, next) => {
    const dishes = await Dish.find()

    res.status(200).json({
        status: 'success',
        data: dishes
    })
})

exports.addDish = catchAsync(async (req, res, next) => {
    req.body._id = ObjectId() // Generate object id
    const newDish = await Dish.create(req.body)

    res.status(201).json({
        status: 'success',
        data: newDish
    })
})

exports.getDish = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const dish = await Dish.findById(id)

    if (!dish) return next(new AppError(`Cannot find a dish with ID ${id}`))

    res.status(200).json({
        status: 'success',
        data: dish
    })
})

exports.updateDish = catchAsync(async (req, res, next) => {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!dish) return next(new AppError(`Cannot find a dish with ID ${id}`))

    res.status(200).json({
        status: 'success',
        data: dish
    })
})

exports.deleteDish = catchAsync(async (req, res, next) => {
    const dish = await Dish.findByIdAndDelete(req.params.id)

    if (!dish) return next(new AppError(`Cannot find a dish with ID ${id}`))

    res.status(204).json({
        status: 'success',
        data: null
    })
})
