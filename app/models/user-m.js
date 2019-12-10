const connection = require('../../db/connection');

const selectUserById = username => {
	// console.log(' in selectUserById model!');
	return connection
		.select('*')
		.from('users')
		.where('username', username)
		.then(([user]) => {
			if (!user) return Promise.reject({ status: 404, msg: 'User not found' });
			else return { user };
		});
};

module.exports = { selectUserById };
