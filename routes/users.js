const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

router.get('/', user_controller.index);

router.get('/sign-up', user_controller.sign_up_get);

router.post('/sign-up', user_controller.sign_up_post);

router.get('/login', user_controller.login_get);

router.post('/login', user_controller.login_post);

router.get('/join-the-club', user_controller.join_the_club_get);

router.post('/join-the-club', user_controller.join_the_club_post);

module.exports = router;
