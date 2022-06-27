/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

const File = require('../models/fileModel');

const APIFeatures = require('../util/apiFeatures');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

exports.createFile = catchAsync(async (req, res, _next) => {
	const newFile = await File.create(req.body);

	res.status(201).json({
		status: 'success',
		id: newFile.id,
	});

	return 0;
});

exports.getAllFiles = catchAsync(async (req, res, _next) => {
	const features = new APIFeatures(
		File.find({ hidden: false || undefined }),
		req.query
	)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const files = await features.query.populate('uploadedBy', 'username');

	res.status(200).json({
		status: 'success',
		data: { files },
	});

	return 0;
});

exports.getItem = catchAsync(async (req, res, next) => {
	const file = await File.findById(req.params.id).populate(
		'uploadedBy',
		'username email rank quadron flight'
	);

	if (!file) return next(new AppError('No file found', 404));

	res.status(200).json({
		status: 'success',
		data: { file },
	});

	return 0;
});

exports.updateItem = catchAsync(async (req, res, next) => {
	const file = await File.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!file) return next(new AppError('No file found', 404));

	res.status(200).json({
		status: 'success',
		data: { file },
	});

	return 0;
});

exports.deleteItem = catchAsync(async (req, res, next) => {
	const file = await File.findByIdAndUpdate(req.params.id, { hidden: true });

	if (!file) return next(new AppError('No file found', 404));

	res.status(204).json({
		status: 'success',
		data: null,
	});

	return 0;
});
