const userRouter = require('express').Router();
const { getUserById } = require('../controllers/user-c.js');
const { badMethod } = require('../error-middleware/error-middleware');

userRouter.get('/:username', getUserById);
userRouter.all('/*', badMethod);

module.exports = { userRouter };

// GET      /api/topics

// GET      /api/users/:username    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// GET      /api/articles/:article_id
// PATCH    /api/articles/:article_id
// POST     /api/articles/:article_id/comments
// GET      /api/articles/:article_id/comments
// GET      /api/articles

// PATCH    /api/comments/:comment_id
// DELETE   /api/comments/:comment_id

// GET      /api
