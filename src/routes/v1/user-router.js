const express = require('express');

const { UserController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');

const router = express.Router();

router.post('/signup', AuthRequestMiddlewares.validateAuthRequest, UserController.create);
router.post('/signin', UserController.signin);
router.post('/role', UserController.addRole);

module.exports = router;