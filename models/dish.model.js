const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: [true, 'Please provide a dish ID']
    },
    name: {
        type: String,
        required: [true, 'Please provide a dish name'],
        trim: true
    },
    cuisine: {
        type: String,
        default: 'międzynarodowa'
    },
    type: {
        type: String,
        default: 'pozostałe'
    },
    category: {
        type: String,
        required: [true, 'Please provide a dish category']
    },
    ingredients: {
        type: [String],
        required: [true, 'Please provide dish ingredients']
    },
    stock: {
        type: Number,
        required: [true, 'Please provide a dish stock']
    },
    currency: {
        type: String,
        required: [true, 'Please provide a dish price currency']
    },
    unitPrice: {
        type: Number,
        required: [true, 'Please provide a dish unit price']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Dish rating cannot be lower than 0'],
        max: [5, 'Dish rating cannot be greater than 5']
    },
    ratesCount: {
        type: Number,
        default: 0,
        min: [0, 'Number of dish reviews cannot be lower than 0']
    },
    description: {
        type: [String],
        required: [true, 'Please provide a dish description']
    },
    images: {
        coverIdx: {
            type: Number,
            default: 0,
            min: [0, 'Cover index cannot be lower than 0']
        },
        gallery: [{
            breakpoints: {
                type: [Number],
                required: [true, 'Please provide dish images breakpoints']
            },
            paths: {
                type: [String],
                required: [true, 'Please provide dish images paths']
            }
        }]
    },
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Review'
        }
    ]
})

const Dish = mongoose.model('Dish', dishSchema)

module.exports = Dish
