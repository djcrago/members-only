const Message = require('../models/message');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

module.exports.new_message_get = asyncHandler(async (req, res, next) => {
  const isLoggedIn = res.locals.currentUser;

  if (isLoggedIn) {
    res.render('new_message_form', { title: 'Write a New Message' });
  } else {
    res.redirect('/');
  }
});

module.exports.new_message_post = [
  // Validate/sanitize req.body
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
      timestamp: Date.now(),
      text: req.body.text,
      author: res.locals.currentUser._id,
    });

    if (!errors.isEmpty()) {
      // Re-render form with passed in values and display error messages
      res.render('new_message_form', {
        title: 'Write a New Message',
        message,
        errors: errors.array(),
      });
    } else {
      // Save the new message to the database
      await message.save();

      res.redirect('/');
    }
  }),
];

module.exports.delete_message_get = asyncHandler(async (req, res, next) => {
  const isLoggedIn = res.locals.currentUser;

  if (isLoggedIn) {
    const isAdmin = res.locals.currentUser.admin;

    if (isAdmin) {
      const message = await Message.findById(req.params.id).exec();

      res.render('delete_message_form', { title: 'Delete Message', message });
    }
  } else {
    res.redirect('/');
  }
});

module.exports.delete_message_post = asyncHandler(async (req, res, next) => {
  const isAdmin = res.locals.currentUser.admin;

  if (isAdmin) {
    await Message.findByIdAndDelete(req.body.messageid).exec();
  }

  res.redirect('/');
});
