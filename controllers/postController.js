const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Обработка получения всех постов
exports.all_post = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().sort({ date: 1 }).exec();
    if (posts.length == 0) {
        return res.status(400).json({ message: 'Посты не найдены' });
    }

    res.status(200).json({ posts })
})

// Обработка создания нового поста
exports.create_post = [
    body('title', 'Название поста не должно быть пустым').trim().notEmpty().escape(),
    body('content', 'Содержание поста не должно быть пустым').trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {

        try {
            const errors = validationResult(req);

            const { title, content } = req.body;

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(400)
            }
            const dbuser = jwt.decode(token);
            const post = new Post({
                user: dbuser.sub,
                title: title,
                content: content,
                date: new Date(),
                viewsCount: 0,
                likesCount: 0,
            });

            await post.save();

            res.status(200).json({ token, post, message: 'Пост успешно создан' })
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'Произошла ошибка при создании поста' })
        }

    })];

// Обработка обновления поста
exports.update_post = [
    body('title', 'Название поста не должно быть пустым').trim().notEmpty().escape(),
    body('content', 'Содержание поста не должно быть пустым').trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {

        try {
            const errors = validationResult(req);
            const { id } = req.params;
            const { title, content } = req.body;

            const post = await Post.findById(id).populate('user').exec();
            if (post.length == 0) {
                return res.status(400).json({ message: 'Пост не найден' });
            };

            const token = req.headers.authorization.split(' ')[1];
            const dbuser = jwt.decode(token);
            console.log(dbuser.sub);
            console.log(String(post.user._id));
            if (!dbuser) {
                return res.status(400).json({ message: 'Невалидный токен' });
            };
            if (String(post.user._id) !== dbuser.sub) {
                return res.status(400).json({ message: 'Редактирование запрещено, вы не являетесь автором поста' })
            };

            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            };

            const upPost = {
                title: title,
                content: content
            };

            const updatedPost = await Post.findByIdAndUpdate(id, { $set: upPost }, { new: true }).exec();

            res.status(400).json({ updatedPost, message: 'Пост успешно обновлен' })
        } catch (err) {
            res.status(400).json({message: 'Произошла ошибка при обновлении поста'})
        }
    })
];
