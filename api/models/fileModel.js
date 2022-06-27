const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	uploadedOn: {
		type: Date,
		default: Date.now(),
	},
	uploadedBy: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'User',
	},
	score: {
		type: Number,
		default: 0,
	},
	tags: {
		type: [String],
		default: [],
	},
	comments: {
		type: [mongoose.Schema.ObjectId],
		ref: 'Comment',
		default: [],
	},
	fileLink: {
		type: String,
		required: true,
		unique: true,
	},
	quarantine: {
		type: Boolean,
		default: false,
	},
	downloads: {
		type: Number,
		default: 0,
	},
	hidden: {
		type: Boolean,
		default: false,
	},
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
