const topicRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topic-c.js');
const { badMethod } = require('../error-middleware/express-errors');

topicRouter
	.route('/')
	.get(getAllTopics)
	.all(badMethod);

module.exports = { topicRouter };

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
