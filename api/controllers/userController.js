/* eslint-disable no-unused-vars */
const User = require('../models/userModel');

const APIFeatures = require('../util/apiFeatures');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

exports.createUser = catchAsync(async (req, res, next) => {
	const newUser = await User.create(req.body);

	res.status(201).json({
		status: 'success',
		id: newUser.id,
	});
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const allUsers = await User.find();

	res.status(200).json({
		status: 'success',
		data: { allUsers },
	});
});

exports.getUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	res.status(200).json({
		status: 'success',
		data: { user },
	});
});

exports.updateUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) return next(new AppError('No user found', 400));

	res.status(200).json({
		status: 'success',
		data: { user },
	});

	return 0;
});

exports.deleteUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, { active: false });

	if (!user) return next(new AppError('No user found', 400));

	res.status(204).json({
		status: 'success',
		data: null,
	});

	return 0;
});
