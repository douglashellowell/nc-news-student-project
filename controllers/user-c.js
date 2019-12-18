const {
	selectUserById,
	insertUser,
	fetchAllUsers
} = require('../models/user-m.js');

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

exports.postUser = (req, res, next) => {
	const { body } = req;
	insertUser(body)
		.then(user => {
			res.status(201).send({ user });
		})
		.catch(err => {
			next(err);
		});
};

exports.getAllUsers = (req, res, next) => {
	fetchAllUsers().then(users => {
		res.status(200).send({ users });
	});
};
