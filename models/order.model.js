const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    dishes: [
        {
            dish: {
                type: mongoose.Schema.ObjectId,
                ref: 'Dish',
            },
            quantity: {
                type: Number,
                required: [true, 'Please provide a dish quantity'],
                min: 1
            }
        }
    ],
    currency: {
        type: String,
        required: [true, 'Please provide an order currency'],
        enum: ['USD', 'EUR']
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an order amount'],
        min: 0,
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
