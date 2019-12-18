const userRouter = require('express').Router();
const {
	getAllUsers,
	getUserById,
	postUser
} = require('../controllers/user-c.js');
const { badMethod } = require('../error-middleware/error-middleware');

userRouter
	.route('/')
	.get(getAllUsers)
	.post(postUser)
	.all(badMethod);

userRouter
	.route('/:username')
	.get(getUserById)
	.all(badMethod);

// userRouter.post('/', postUser);
// userRouter.get('/:username', getUserById);
// userRouter.all('/*', badMethod);

module.exports = { userRouter };
