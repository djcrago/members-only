const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

router.get('/new-message', message_controller.new_message_get);

router.post('/new-message', message_controller.new_message_post);

module.exports = router;
