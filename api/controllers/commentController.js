const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const File = require('../models/fileModel');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

exports.rejectCommentsWithInvalidFileID = catchAsync(async (req, res, next) => {
	// If there is no file ID kick it back
	if (!req.params.fileId) {
		return next(new AppError('No file ID specified', 400));
	}
	// If the file ID is not valid kick it back
	if (!mongoose.Types.ObjectId.isValid(req.params.fileId)) {
		return next(new AppError('Invalid file ID', 400));
	}
	// try to find the file
	const file = await File.findById(req.params.fileId);
	// If the file cant be found, kick it back
	if (!file) {
		return next(new AppError('File ID not found', 400));
	}
	// exhausted exceptions, hand the request off to the route handler
	return next();
});

exports.createComment = catchAsync(async (req, res, next) => {
	const newComment = await Comment.create({
		...req.body,
		fileID: req.params.fileId,
	});

	res.status(201).json({
		status: 'success',
		data: newComment,
	});
});

exports.getAllComments = catchAsync(async (req, res, next) => {
	const allComments = await Comment.find({
		fileID: req.params.fileId,
	}).populate({
		path: 'commenterID',
		select: 'username',
	});

	res.status(200).json({
		status: 'success',
		data: allComments,
	});
});

exports.updateComment = catchAsync(async (req, res, next) => {
	const updatedComment = await Comment.findByIdAndUpdate(
		req.params.commentid,
		req.body,
		{ new: true, runValidators: true }
	);

	res.status(200).json({
		status: 'success',
		data: updatedComment,
	});
});

exports.deleteComment = catchAsync(async (req, res, next) => {
	await Comment.findByIdAndDelete(req.params.commentid);
	res.status(204).json({
		status: 'success',
		data: null,
	});
});
