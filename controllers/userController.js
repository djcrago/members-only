const User = require('../models/user');
const Message = require('../models/message');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

module.exports.index = asyncHandler(async (req, res, next) => {
  res.render('index', { title: 'Home Page', user: req.user });
});

module.exports.user_detail = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: User detail');
});

module.exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign_up_form', { title: 'Sign-up Page' });
});

module.exports.sign_up_post = [
  // Sanitize/validate form fields
  body('first_name', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Last name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('username', 'Username must be an email')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters')
    .escape()
    .isEmail()
    .custom(async (value) => {
      const userExists = await User.findOne({ username: value }).exec();
      if (userExists) {
        throw new Error('Email is already in use');
      }
    }),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .escape(),
  body('password_confirm', 'Passwords do not match')
    .trim()
    .custom((value, { req }) => {
      const password = req.body.password;
      const passwordConfirm = value;
      return password === passwordConfirm;
    }),

  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('sign_up_form', {
          title: 'Sign-up Page',
          user: req.body,
          errors: errors.array(),
        });
      } else {
        try {
          const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: hashedPassword,
            member: false,
          });
          await user.save();
          res.redirect('/');
        } catch (err) {
          return next(err);
        }
      }
    });
  }),
];

module.exports.login_get = asyncHandler(async (req, res, next) => {
  res.render('login_form', { title: 'Login Page' });
});

module.exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
});

module.exports.log_out_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports.join_the_club_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Join the club get');
});

module.exports.join_the_club_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Join the club post');
});
