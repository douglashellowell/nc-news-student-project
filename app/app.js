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
	console.log('it is an err alright!');
	if (err.status) {
		next(err);
	} else {
		console.log('psql error', err);
		const psqlErrors = {
			'42703': [400, 'Column does not exist'],
			'22P02': [400, 'Invalid input syntax'],
			'23503': [400, 'Target does not exist in database']
		};
		const { code } = err;
		res.status(psqlErrors[code][0]).send({ msg: psqlErrors[code][1] });
	}
});

// Express/Custom Error middleware
app.use((err, req, res, next) => {
	console.log('cutsom errors middleware', err);
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
