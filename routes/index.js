var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController.js');
const PostController = require('../controllers/postController.js');
const mongoose = require('mongoose');
const verifyToken = require('../middleware/auth.js')
const asyncHandler = require('express-async-handler')
const passport = require('passport')

/* GET home page. */
router.post('/register', UserController.users_post);

router.post('/login', UserController.login_post);

router.get('/', PostController.all_post);

router.post('/new', passport.authenticate('jwt', {session: false }), PostController.create_post);

router.put('/post/:id', passport.authenticate('jwt', {session: false }), PostController.update_post);

router.get('/index', passport.authenticate('jwt', { session: false }), asyncHandler(async(req, res, next) => {
  res.json({succes: "Успешно"})
}))

module.exports = router;
