const connection = require('../db/connection');

const selectUserById = username => {
	return connection
		.select('*')
		.from('users')
		.where('username', username)
		.then(([user]) => {
			if (!user) return Promise.reject({ status: 404, msg: 'User not found' });
			else return user;
		});
};

const insertUser = user => {
	return connection
		.returning('*')
		.insert(user)
		.into('users')
		.then(([user]) => {
			return user;
		});
};

const fetchAllUsers = () => {
	return connection
		.select('*')
		.from('users')
		.then(users => {
			return users;
		});
};

module.exports = { selectUserById, insertUser, fetchAllUsers };
