const Message = require('../models/message');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

module.exports.new_message_get = asyncHandler(async (req, res, next) => {
  res.render('new_message_form', { title: 'Write a New Message' });
});

module.exports.new_message_post = [
  body('title', 'Title of message must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('text', 'Body of message must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      timestamp: Date.now(),
      author: res.locals.currentUser._id,
    });

    if (!errors.isEmpty()) {
      res.render('new_message_form', {
        title: 'Write a New Message',
        message,
        errors: errors.array(),
      });
    } else {
      await message.save();
      res.redirect('/');
    }
  }),
];

module.exports.delete_message_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  res.render('delete_message_form', { title: 'Delete Message', message });
});

module.exports.delete_message_post = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.body.messageid).exec();
  res.redirect('/');
});
