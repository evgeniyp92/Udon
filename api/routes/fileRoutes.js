const express = require('express');
const fileController = require('../controllers/fileController');
const commentRouter = require('./commentRoutes');
const authController = require('../controllers/authController');

const router = express.Router();

router.use('/:fileId/comments', commentRouter);

router
	.route('/')
	.get(authController.protect, fileController.getAllFiles)
	.post(fileController.createFile);

router
	.route('/:id')
	.get(fileController.getItem)
	.patch(fileController.updateItem)
	.delete(fileController.deleteItem);

module.exports = router;
