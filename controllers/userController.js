const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');



exports.users_post = asyncHandler(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const [usrname, mail] = await Promise.all([
            User.findOne({ username: username }).exec(),
            User.findOne({ email: email }).exec()
        ])

        if (usrname) {
            return res.status(400).json({ message: "username уже используется" })
        } else if (mail) {
            return res.status(400).json({ message: "email уже используется" })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username: username,
                email: email,
                password: hashedPassword
            })

            await user.save();
            res.status(200).json({ user, message: "Регистрация прошла успешно" });
        }

    } catch (err) {
        res.status(400).json({ message: "Произошла ошибка при регистрации" });
    }
})

exports.login_post = asyncHandler(async (req, res, next) => {
    try {
        const { login, password } = req.body;

        const user = await User.findOne({ username: login }).exec();

        if (!user) {
            return res.status(400).json({ message: "Некорректный логин или пароль" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Некорректный логин или пароль" });
        }

        const token = jwt.sign(
            { sub: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({ token, user, message: "Авторизация прошла успешно" });
    } catch (err) {
        res.status(400).json({ message: "Произошла ошибка при авторизации" });
    }
});

