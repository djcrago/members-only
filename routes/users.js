const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

router.get('/', user_controller.index);

router.get('/sign-up', user_controller.sign_up_get);

router.post('/sign-up', user_controller.sign_up_post);

router.get('/login', user_controller.login_get);

router.post('/login', user_controller.login_post);

router.get('/log-out', user_controller.log_out_get);

router.get('/join-the-club', user_controller.join_the_club_get);

router.post('/join-the-club', user_controller.join_the_club_post);

router.get('/become-admin', user_controller.become_admin_get);

router.post('/become-admin', user_controller.become_admin_post);

router.get('/:id', user_controller.user_detail);

module.exports = router;
