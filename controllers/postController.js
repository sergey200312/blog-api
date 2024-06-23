const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

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
                return res.status(400).json({ errors });
            }

            const post = new Post({
                title: title,
                content: content,
                date: new Date(),
                viewsCount: 0,
                likesCount: 0,
            });

            await post.save();

            res.status(200).json({ post, message: 'Пост успешно создан' })
        } catch (err) {
            res.status(400).json({ message: 'Произошла ошибка при создании поста' })
        }

    })];
