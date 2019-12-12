const commentRouter = require('express').Router();
const { badMethod } = require('../error-middleware/express-errors');
const {
	patchCommentById,
	deleteCommentById
} = require('../controllers/comment-c.js');

commentRouter
	.route('/:comment_id')
	.patch(patchCommentById)
	.delete(deleteCommentById)
	.all(badMethod);

module.exports = { commentRouter };
