const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');



exports.users_post = asyncHandler(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const [usrname, mail] = await Promise.all([
            User.findOne({username: username}).exec(),
            User.findOne({email: email}).exec()
        ])
        
        if(usrname) {
            return res.status(400).json({message: "username уже используется"})
        } else if (mail) {
            return res.status(400).json({message: "email уже используется"})
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


