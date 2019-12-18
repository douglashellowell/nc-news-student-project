const articleRouter = require('express').Router();
const { badMethod } = require('../error-middleware/error-middleware.js');

const {
	getAllArticles,
	getComments,
	postComment,
	getArticleById,
	patchArticleById,
	postArticle,
	deleteArticleById
} = require('../controllers/article-c.js');

// Get all Route
articleRouter
	.route('/')
	.get(getAllArticles)
	.post(postArticle)
	.all(badMethod);

// Comments Route
articleRouter
	.route('/:article_id/comments')
	.get(getComments)
	.post(postComment)
	.all(badMethod);

// Article Route
articleRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(patchArticleById)
	.delete(deleteArticleById)
	.all(badMethod);

module.exports = { articleRouter };
