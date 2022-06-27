/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DB_CONN_HOST.replace(
	'<PASSWORD>',
	process.env.DB_CONN_PW
).replace('<USERNAME>', process.env.DB_CONN_UN);

const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true };

process.on('uncaughtException', err => {
	console.error('** UNCAUGHT EXCEPTION **');
	console.error(err.name, err.message);
	throw new Error('Uncaught exception');
});

mongoose
	.connect(DB, mongoConfig)
	.then(() => console.log('DB connected'))
	.catch(err => console.log(err));

const port = 4000;
const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

process.on('unhandledRejection', err => {
	console.error('** UNHANDLED REJECTION **');
	console.error(err.name, err.message);
	server.close(() => {
		throw new Error('Unhandled rejection');
	});
});
