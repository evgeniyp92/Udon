const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	commenterID: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'User',
	},
	fileID: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'File',
	},
	postedOn: {
		type: Date,
		default: Date.now(),
	},
	score: {
		type: Number,
		default: 0,
	},
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
