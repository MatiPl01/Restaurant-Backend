const mongoose = require('mongoose')

const currenciesSchema = new mongoose.Schema({
    symbols: [{
        currency: {
            type: String,
            required: [true, 'Please provide a currency name'],
            unique: true,
            trim: true
        },
        symbol: {
            type: String,
            required: [true, 'Please provide a currency symbol'],
            unique: true,
            trim: true
        },
    }],
    mainCurrency: {
        type: String,
        required: [true, 'Please provide a main currency name']
    },
    exchangeRates: [{
        from: {
            type: String,
            required: [true, 'Please provide a currency name from which you will exchange money']
        },
        to: {
            type: String,
            required: [true, 'Please provide a currency name to which you will exchange money']
        },
        ratio: {
            type: Number,
            required: [true, 'Please provide an exchange ratio']
        }
    }]
})

const Currencies = mongoose.model('Currencies', currenciesSchema)

module.exports = Currencies
