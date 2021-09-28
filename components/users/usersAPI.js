const express = require('express');
const usersController = require('./usersController');
const Route = express.Router();
const passport = require('passport');
// @route   api/users/
Route.route('/').get(usersController.findAll);
Route.route('/login').post(usersController.login);
Route.route('/signup').post(usersController.signup);
Route.route('/password/reset').post(usersController.resetPassword);
Route.route('/password/reset/verify').post(usersController.verifyPassword);
Route.route('/password/reset/change').post(
	passport.authenticate('both', { session: false }),
	usersController.changeResetPassword
);
Route.route('/profile').get(
	passport.authenticate('user', { session: false }),
	usersController.profile
);
module.exports = Route;
