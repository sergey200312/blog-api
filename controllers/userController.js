const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

class UserController {

    users_post = asyncHandler(async(req, res, next) => {
        try {
            const hashedPassword = bcrypt.hash(req.body.password, 10);

            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })

            await user.save();
            res.sendStatus(200).json(user, {message: "Регистрация прошла успешно"});
        } catch (err) {
            res.sendStatus(400).json({message: "Произошла ошибка при регистрации"});
        }
    })
}

module.exports = UserController;


