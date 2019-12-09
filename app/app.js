const express = require('express');
const app = express();

const { apiRouter } = require('./routers/apiRouter.js');

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
	res.status(404).send({ msg: 'Route not found' });
});

// PSQL error middleware
app.use((err, req, res, next) => {
	if (err.status) {
		next(err);
	} else {
		const psqlErrors = {
			code123: [400, 'Bad Request']
		};
	}
});

// Express/Custom Error middleware
app.use((err, req, res, next) => {
	res.status(err.status).send({ msg: err.msg });
});

module.exports = { app };

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
