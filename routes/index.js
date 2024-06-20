var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController.js');
const mongoose = require('mongoose');

/* GET home page. */
router.post('/register', UserController.users_post)

module.exports = router;
