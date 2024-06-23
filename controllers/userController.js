const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { ValidatorsImpl } = require('express-validator/lib/chain/validators-impl.js');


// Обработка регистрации пользователя
exports.users_post = [
    body('username').trim().isLength({ min: 2, max: 20 }).withMessage('Пароль должен содержать от 2 до 20 символов').escape()
        .custom(async(username) => {
            const checkUsername = await User.findOne({ username }).exec();
            if(checkUsername) {
                throw new Error("Это имя пользователя уже используется, придумайте другой");
            }
        }),
    body('email').trim().isEmail().withMessage('Введите корректный email адрес').escape()
        .custom(async(email) => {
            const checkEmail = await User.findOne({ email }).exec();
            if(checkEmail) {
                throw new Error("Этот почтовый ящик уже используется")
            }
        }),
    body('password', 'Пароль должен содержать от 4 до 15 символов').trim().isLength({ min: 4, max: 15}).escape(),
    body('re-password', 'Пароли не сопвадают')
        .custom((value, { req }) => {
            return value === req.body.password;
        }),

    asyncHandler(async (req, res, next) => {
    try {
        const errors = validationResult(req);

        const { username, email, password } = req.body;

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        await user.save();
        res.status(200).json({ user, message: "Регистрация прошла успешно" });

    } catch (err) {
        res.status(400).json({ message: "Произошла ошибка при регистрации" });
    }
})];

// Обработка авторизации пользователя
exports.login_post = [
    body('login', 'Введите логин').trim().notEmpty().escape(),
    body('password', 'Введите пароль').trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {
    try {
        const errors = validationResult(req);
         
        const { login, password } = req.body;

        const user = await User.findOne({ username: login }).exec();

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
})];

