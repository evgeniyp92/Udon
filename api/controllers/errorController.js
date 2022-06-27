/* eslint-disable no-param-reassign */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

const sendError = (error, res) => {
	if (error.isOperational) {
		return res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		});
	}

	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
		stacktrace: error.stack,
	});

	return 0;
};

module.exports = (err, req, res, _next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'Unhandled error';
	sendError(err, res);
};
