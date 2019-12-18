const express = require('express');
const app = express();
const {
	psqlErrorHandling,
	customErrorHandling,
	noRouteErrorHandling
} = require('./error-middleware/error-middleware');

const { apiRouter } = require('./routers/apiRouter.js');

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', noRouteErrorHandling);

// PSQL error middleware
app.use(psqlErrorHandling);

// Express/Custom Error middleware
app.use(customErrorHandling);

module.exports = app;

/*

DOUGS SERVER

/

*/

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
