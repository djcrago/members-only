const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const Message = require('../models/message');

module.exports.index = asyncHandler(async (req, res, next) => {
  res.render('index', { title: 'Health Club' });
});

module.exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sign-up get');
});

module.exports.sign_up_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sign-up post');
});

module.exports.login_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Login get');
});

module.exports.login_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Login post');
});

module.exports.join_the_club_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Join the club get');
});

module.exports.join_the_club_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Join the club post');
});
