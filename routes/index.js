var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController.js');
const PostController = require('../controllers/postController.js');
const CommentController = require('../controllers/commentController.js');
const mongoose = require('mongoose');
const verifyToken = require('../middleware/auth.js')
const asyncHandler = require('express-async-handler')
const passport = require('passport')
const upload = require('../config/multer.js')

/* GET home page. */
router.post('/register', UserController.users_post);

router.post('/login', UserController.login_post);

router.get('/', PostController.all_post);

router.get('/post/:id', PostController.detail_post);

router.post('/upload', upload.single("image"), PostController.upload);

router.post('/new', passport.authenticate('jwt', {session: false }), PostController.create_post);

router.put('/post/update/:id', passport.authenticate('jwt', {session: false }), PostController.update_post);

router.post('/post/:id/comment/create', passport.authenticate('jwt', {session: false }), CommentController.create_comment);

router.get('/post/:id/comments', CommentController.get_comments);

router.get('/my-posts', passport.authenticate('jwt', {session: false }), PostController.my_posts);

router.delete('/post/delete/:id', passport.authenticate('jwt', {session: false }), PostController.delete_post);

router.get('/user', passport.authenticate('jwt', {session: false }), UserController.get_user);

router.get('/index', passport.authenticate('jwt', { session: false }), asyncHandler(async(req, res, next) => {
  res.json({succes: "Успешно"})
}))

module.exports = router;
