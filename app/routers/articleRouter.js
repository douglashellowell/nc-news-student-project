const articleRouter = require('express').Router();
const { badMethod } = require('../error-middleware/express-errors.js');

const {
	getAllArticles,
	// getComment,
	// postComment,
	getArticleById,
	patchArticleById
} = require('../controllers/article-c.js');

// Get all Route
articleRouter
	.route('/')
	.get(getAllArticles)
	.all(badMethod);

// Comments Route
articleRouter
	.route('/:article_id/comments')
	// .get(getComment)
	// .post(postComment)
	.all(badMethod);

// Article Route
articleRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(patchArticleById)
	.all(badMethod);

module.exports = { articleRouter };

// GET      /api/topics

// GET      /api/users/:username

// GET      /api/articles/:article_id
// PATCH    /api/articles/:article_id
// POST     /api/articles/:article_id/comments
// GET      /api/articles/:article_id/comments
// GET      /api/articles

// PATCH    /api/comments/:comment_id
// DELETE   /api/comments/:comment_id

// GET      /api
