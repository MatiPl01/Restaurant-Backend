const catchAsync = require('../utils/catch-async')
const Review = require('../models/review.model')

exports.addReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body)

    res.status(201).json({
        status: 'success',
        data: newReview
    })
})
