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
