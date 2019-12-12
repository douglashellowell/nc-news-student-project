const { selectUserById } = require('../models/user-m.js');

exports.getUserById = (req, res, next) => {
	const { username } = req.params;
	selectUserById(username)
		.then(user => {
			res.status(200).send({ user });
		})
		.catch(err => {
			next(err);
		});
};
