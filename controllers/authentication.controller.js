const User = require('../models/user.model')

exports.signUp = async (req, res, next) => {
    const newUser = User.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
}
