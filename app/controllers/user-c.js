const { selectUserById } = require('../models/user-m.js');

exports.getUserById = (req, res, next) => {
	console.log('Reached getUserById controller');
	selectUserById().then(users => {
		res.status(200).send(users);
	});
};
