const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const AppError = require('./util/appError');
const errorController = require('./controllers/errorController');

const app = express();

app.use(helmet());

app.use(cors({ origin: '*' }));

app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: `You have made 1000 requests in the past hour. 
	Please wait until making another request.`,
});
app.use('/api', limiter);

app.use(xss());

app.use(morgan('dev'));

// Signup and login outside of the protect
app.use('/api/v1/auth', require('./routes/authRoutes'));
// All other routes inside of the protect
app.use('/api/v1', require('./controllers/authController').protect);
app.use('/api/v1/files', require('./routes/fileRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
// TODO: Write guards against perusing comments at will
app.use('/api/v1/comments', require('./routes/commentRoutes'));

app.all('*', (req, res, next) => {
	next(new AppError(`Requested resource does not exist on this server`, 404));
});

app.use(errorController);

module.exports = app;
