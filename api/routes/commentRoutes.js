const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.use(commentController.rejectCommentsWithInvalidFileID);

router
	.route('/')
	.get(commentController.getAllComments)
	.post(commentController.createComment);

router
	.route('/:commentid')
	.patch(commentController.updateComment)
	.delete(commentController.deleteComment);

module.exports = router;
