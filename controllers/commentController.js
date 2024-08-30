const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Контроллер для создания комментария к пост
exports.create_comment = [
    body("text", "Комментарий не должен быть пустым").trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            console.log('sfss')
            const { text } = req.body;
            console.log(';sfs');
            const { id } = req.params;
            const token = req.headers.authorization.split(' ')[1];
            console.log(token);

            if (!token) {
                console.log('Пусто');
                return res.status(400);
            }
            

            const dbuser = jwt.decode(token);
            const comment = new Comment({
                user: dbuser.sub,
                post: id,
                text: text,
                date: new Date(),
            })

            await comment.save();


            res.status(200).json({ message: "Комментарий создан", comment })

        } catch (err) {
            res.status(400).json({ message: "Ошибка при создании комментария" });
        }


    })

]

// Контроллер для получения комментариев в посте
exports.get_comments = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const commentList = await Comment.find({ post: id }).populate('user').exec();

        res.status(200).json({ commentList });
    } catch (err) {
        res.status(500).json({ message: "Ошибка на сервере при получения постов" })
    }

})