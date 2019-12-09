const apiRouter = require('express').Router();
const { userRouter } = require('./userRouter.js');
const { articleRouter } = require('./articleRouter.js');
const { badMethod } = require('../error-middleware/express-errors');
const { topicRouter } = require('./topicRouter.js');

apiRouter
	.route('/')
	.get(() => {
		console.log('you have made a get request to the api root');
	})
	.all(badMethod);
// .use('/users', userRouter)

apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);

module.exports = { apiRouter };

// Not yet complete								_
// Part worked on, come back later				/
// Plugged, endpoint reachable					✓
// Model sending back basic data				✓✓
// Basic Errors tested							✓✓✓
// Queries tested (if applicable)				✓✓✓✓
// Edge case error tested						✓✓✓✓✓
// complete										~★~

////////////////////////////////////////////
/////////// apiRouter :: /api /////////////			_
// GET ~ /										✓

////////////////////////////////////////////
////// topicRouter	:: /api/topics	///////			/
// GET ~ /
//-c :: getAllTopics							✓
//-m :: selectAllTopics							✓

/////////////////////////////////////////
/////// userRouter :: /api/users ///////			/
// GET ~ /:username
//-c :: getUserById 							✓
//-m :: selectUserById 							✓

///////////////////////////////////////////
//// articleRouter :: /api/articles  /////		_
// GET ~ /										✓
//-c :: getAllArticles							✓
//-m :: selectAllArticles						✓
//-------------
// GET ~ /:article_id
//-c :: getArticleById							✓
//-m :: selectArticleById						✓
// PATCH ~ /:article_id
//-c :: patchArticleById						✓
//-m :: updateArticeById						✓
//-------------
// POST ~ /:article_id/comments
//-c :: postComment								✓
//-m :: insertComment							✓
// GET ~ /:article-id/comments
//-c :: getArticleById							✓
//-m :: selectArticleById						✓

/////////////////////////////////////////
//// commentRouter :: /api/comments ////		_
// PATCH ~ /:comment_id							_
// DELETE ~/:comment_id
