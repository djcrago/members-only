const User = require('../models/user');
const Message = require('../models/message');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

module.exports.index = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find().populate('author').exec();

  res.render('index', { title: 'Home Page', all_messages: allMessages });
});

module.exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign_up_form', { title: 'Sign-up Page' });
});

module.exports.sign_up_post = [
  // Validate/sanitize req.body
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
    .custom(async (value) => {
      const userExists = await User.findOne({ username: value }).exec();

      if (userExists) {
        throw new Error('Email is already in use');
      }
    })
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters')
    .escape()
    .isEmail(),
  body('password', 'Password must be at least 6 characters')
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body('password_confirm', "Passwords don't match")
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

      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
        member: false,
      });

      if (!errors.isEmpty()) {
        // Re-render form with passed in values and display error messages
        res.render('sign_up_form', {
          title: 'Sign-up Page',
          user: req.body,
          errors: errors.array(),
        });
      } else {
        try {
          // Save the new user to the database
          await user.save();

          res.redirect('/users/login');
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
  const isLoggedIn = res.locals.currentUser;

  if (isLoggedIn) {
    res.render('join_the_club_form', { title: 'Join the Club' });
  } else {
    res.redirect('/');
  }
});

module.exports.join_the_club_post = [
  // Validate/sanitize req.body
  body('passcode', 'Incorrect passcode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Passcode must not be empty')
    .escape()
    .custom((value) => {
      return value === process.env.SECRET_MEMBER_PASSCODE;
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: res.locals.currentUser._doc.first_name,
      last_name: res.locals.currentUser._doc.last_name,
      username: res.locals.currentUser._doc.username,
      password: res.locals.currentUser._doc.password,
      member: true,
      _id: res.locals.currentUser._id,
    });

    if (!errors.isEmpty()) {
      // Re-render form and display error messages
      res.render('join_the_club_form', {
        title: 'Join the Club',
        errors: errors.array(),
      });
    } else {
      // Update the user in the database
      await User.findByIdAndUpdate(res.locals.currentUser._id, user, {});

      res.redirect('/');
    }
  }),
];

module.exports.become_admin_get = asyncHandler(async (req, res, next) => {
  const isLoggedIn = res.locals.currentUser;

  if (isLoggedIn) {
    const isMember = res.locals.currentUser.member;

    if (isMember) {
      res.render('become_admin_form', { title: 'Become an Admin' });
    }
  } else {
    res.redirect('/');
  }
});

module.exports.become_admin_post = [
  // Validate/sanitize req.body
  body('passcode', 'Passcode must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value) => {
      return value === process.env.SECRET_ADMIN_PASSCODE;
    })
    .withMessage('Incorrect passcode'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: res.locals.currentUser._doc.first_name,
      last_name: res.locals.currentUser._doc.last_name,
      username: res.locals.currentUser._doc.username,
      password: res.locals.currentUser._doc.password,
      member: res.locals.currentUser._doc.member,
      admin: true,
      _id: res.locals.currentUser._id,
    });

    if (!errors.isEmpty()) {
      // Re-render form and display error messages
      res.render('become_admin_form', {
        title: 'Become an Admin',
        errors: errors.array(),
      });
    } else {
      // Update the user in the database
      await User.findByIdAndUpdate(res.locals.currentUser._id, user, {});

      res.redirect('/');
    }
  }),
];
