const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Контроллер для получения всех постов
exports.all_post = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().populate('user', 'username').sort({ date: 1 }).exec();
    if (posts.length == 0) {
        return res.status(400).json({ message: 'Посты не найдены' });
    }

    const postsWithFormattedDate = posts.map(post => post.toJSON());
    res.status(200).json({ posts: postsWithFormattedDate });
})

// Контроллер для получения конкретного поста
exports.detail_post = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    const detailPost = await Post.findById(id).populate('user').exec();


    if(!detailPost) {
        return res.status(404).json({message: 'Пост не найден'});
    }

    detailPost.viewsCount += 1;

    await detailPost.save();

    return res.status(200).json({detailPost, message: 'Пост успешно найден'});
});

// Контроллер для создания поста
exports.create_post = [
    body('title', 'Название поста не должно быть пустым').trim().notEmpty().escape(),
    body('content', 'Содержание поста не должно быть пустым').trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {

        try {
            const errors = validationResult(req);

            const { title, content, image } = req.body;

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
                image: image,
                date: new Date(),
                viewsCount: 0,
                likesCount: 0,
            });

            await post.save();

            res.status(200).json({ token, post, message: 'Пост успешно создан' })
        } catch (err) {
            res.status(400).json({ message: 'Произошла ошибка при создании поста' })
        }
    })];

// Контроллер для обновления поста
exports.update_post = [
    body('title', 'Название поста не должно быть пустым').trim().notEmpty().escape(),
    body('content', 'Содержание поста не должно быть пустым').trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {

        try {
            const errors = validationResult(req);
            const { id } = req.params;
            const { title, content, image } = req.body;

            const post = await Post.findById(id).populate('user').exec();
            if (!post) {
                return res.status(400).json({ message: 'Пост не найден' });
            };

            const token = req.headers.authorization.split(' ')[1];
            const dbuser = jwt.decode(token);
            if (!dbuser) {
                return res.status(400).json({ message: 'Невалидный токен' });
            };

            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            };

            const upPost = {
                title: title,
                content: content,
                image: image
            };

            const updatedPost = await Post.findByIdAndUpdate(id, { $set: upPost }, { new: true }).exec();

            res.status(200).json({ updatedPost, message: 'Пост успешно обновлен' })
        } catch (err) {
            res.status(400).json({message: 'Произошла ошибка при обновлении поста'})
        }
    })
];

// Контроллер для удаления поста
exports.delete_post = asyncHandler(async(req, res, next) => {
    try {
        console.log('fsff');
        const { id } = req.params;
        console.log('fsdfs')

        const post = await Post.findById(id).exec();
        console.log('проверка');
        if (!post) {
            console.log('не найдено')
            return res.status(400).json({ message: 'Пост не найден' });
        };
        console.log('sdfss')
        const token = req.headers.authorization.split(' ')[1];
        console.log('dffsf')
        const dbuser = jwt.decode(token);
        if (!dbuser) {
            return res.status(400).json({ message: 'Невалидный токен' });
        };
        // if (String(post.user._id) !== dbuser.sub) {
        //     return res.status(400).json({ message: 'Удаление поста запрещено, вы не являетесь автором поста' })
        // };

        const deletePost = await Post.deleteOne({_id: post._id}).exec();

        res.status(200).json({deletePost, message: 'Пост успешно удален'});


        
    } catch (err) {
        res.status(400).json({message: 'Произошла ошибка при удалении поста'})
    }
});

// Контроллер для отображения собственных постов пользователя
exports.my_posts = asyncHandler(async(req, res, next) => {
    const allPosts = await Post.find().populate('user', 'username _id').sort({date: 1}).exec();
    
    if(allPosts.length == 0) {
        return res.status(400).json({message: 'Посты не найдены'});
    }

    const token = req.headers.authorization.split(' ')[1];
        const dbuser = jwt.decode(token);
        if (!dbuser) {
            return res.status(400).json({ message: 'Невалидный токен' });
        }

    const myPosts = allPosts.filter(post => String(post.user._id) === dbuser.sub);

    if(myPosts.length == 0) {
        return res.status(400).json({message: 'У вас нет постов'})
    }

    return res.status(200).json({myPosts});
});

exports.upload = async(req, res) => {
    try {
        if (req.file) {
            res.status(201).json({
                message: 'Изображение загружено успешно',
                imageUrl: req.file.path, // URL загруженного изображения в Cloudinary
            });
        } else {
            res.status(400).json({ message: 'Ошибка при загрузке изображения' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Произошла ошибка при загрузке изображения' });
    }
};