console.log('fdfdfd')

const extractFile = require('../middleware/file');
const userController = require('../controller/user');

const express = require('express');
const router = express.Router();

router.post('/signup', extractFile, userController.register);

router.post('/signin', userController.signIn);

module.exports = router;