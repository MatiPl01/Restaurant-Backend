const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user ID']
    },
    dish: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dish',
        required: [true, 'Please provide a dish ID']
    },
    title: {
        type: String,
        required: [true, 'Please provide a review title']
    },
    body: {
        type: [String],
        required: [true, 'Please provide a review content']
    },
    date: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a review rating'],
        min: 0,
        max: 5
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
