/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	passwordConfirm: {
		type: String,
		required: true,
		validate: {
			// validate that password and passwordConfirm match
			validator(el) {
				return el === this.password;
			},
			message: 'Passwords do not match',
		},
	},
	rank: {
		type: Number,
		required: true,
		default: 0,
	},
	squadron: {
		type: String,
		required: true,
		default: '',
	},
	flight: {
		type: String,
		required: true,
		default: '',
	},
	lastSeen: {
		type: Date,
	},
	reports: {
		type: [Object],
		default: [],
	},
	restrictionLevel: {
		type: Number,
		default: 0,
	},
	restrictionExpires: {
		type: Date,
		default: null,
	},
	restrictionCount: {
		type: Number,
	},
	passwordChanged: {
		type: Date,
	},
	passwordResetToken: {
		type: String,
	},
	filesUpvoted: {
		type: [mongoose.Schema.ObjectId],
		default: [],
	},
	filesDownvoted: {
		type: [mongoose.Schema.ObjectId],
		default: [],
	},
	commentsUpvoted: {
		type: [mongoose.Schema.ObjectId],
		default: [],
	},
	active: {
		type: Boolean,
		default: true,
	},
});

// Hash and salt password before saving
userSchema.pre('save', async function (next) {
	// if the password hasnt been modified, skip the logic below
	if (!this.isModified('password')) return next();

	// obfuscate with an auto-generated hash and salt
	this.password = await bcrypt.hash(this.password, 12);
	// erase passwordConfirm
	this.passwordConfirm = undefined;

	return next();
});

// Validate if stored password matches provided password
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

// set the user's last api interaction time to now
userSchema.methods.setLastSeen = async function () {
	this.lastSeen = new Date();
	await this.save({
		// only validate the updated field
		validateModifiedOnly: true,
	});
};

userSchema.methods.changedPasswordSince = function (timestamp) {
	if (this.passwordChanged) {
		const changedTimeStamp = parseInt(
			this.passwordChanged.getTime() / 1000,
			10
		);
		return changedTimeStamp > timestamp;
	}
	return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
