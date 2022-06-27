const jsonWebToken = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');

const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

/* --------------------------------- SIGN UP -------------------------------- */
exports.signUp = catchAsync(async (req, res, next) => {
	await User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		rank: req.body.rank,
		squadron: req.body.squadron,
		flight: req.body.flight,
	});

	res.status(201).json({
		status: 'Success',
		info: 'User created',
	});
});

/* --------------------------------- LOG IN --------------------------------- */
exports.login = catchAsync(async (req, res, next) => {
	const { username, password } = req.body;

	// kick back malformed queries
	if (!username || !password) {
		return next(new AppError(`No username and/or password specified`, 400));
	}

	// check if user exists
	const user = await User.findOne({ username });

	// If the user can't be find kick back an error
	if (!user) {
		return next(new AppError(`Invalid credentials`, 400));
	}

	if (!(await user.correctPassword(password, user.password))) {
		return next(new AppError(`Invalid credentials`, 400));
	}

	// If the user is found and the password is correct, create a token
	const token = jsonWebToken.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: 60 * 60 * 1000,
	});

	// set up the token as a cookie
	res.cookie('jwt', token, {
		expires: new Date(Date.now() + 60 * 60 * 1000),
		httpOnly: true, // prevents the cookie from being read by client-side javascript
		sameSite: true, // csrf protection
		secure: true, // only send this cookie over https
	});

	// set the user's last login time to now
	await user.setLastSeen();

	return res.status(200).json({
		status: 'Success',
		message: 'Authentication successful',
		token,
	});
});

/* --------------------------------- PROTECT -------------------------------- */
exports.protect = catchAsync(async (req, res, next) => {
	let token;

	// if the jwt is being passed as a bearer token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	// if the jwt is being passed as a cookie
	// TODO: Test properly
	if (req.cookies?.jwt) {
		token = req.cookies.jwt;
	}

	// kick back no token provided
	if (!token) {
		return next(new AppError(`No token provided`, 400));
	}

	// try to decode the token
	const decoded = await promisify(jsonWebToken.verify)(
		token,
		process.env.JWT_SECRET
	);

	// try to find user
	const currentUser = await User.findById(decoded.id);

	// kick back if user can't be found
	if (!currentUser) {
		return next(new AppError(`Auth error: Token invalid`, 400));
	}

	// kick back if user has updated password since
	// TODO: Modify this so that we unset all the user's relevant cookies
	if (currentUser.changedPasswordSince(decoded.iat)) {
		return next(
			new AppError(`Auth error: Password changed after token issued`, 400)
		);
	}

	req.user = currentUser;
	return next();
});
