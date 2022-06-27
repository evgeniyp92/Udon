module.exports = fn => (request, response, next) => {
	fn(request, response, next).catch(err => next(err));
};
