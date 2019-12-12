const connection = require('../db/connection');

exports.checkExists = (table, column, value) => {
	return connection
		.select(column)
		.from(table)
		.where({ [column]: value })
		.then(response => {
			if (!response.length) {
				return Promise.reject({
					status: 404,
					msg: `"${value}" not found`
				});
			} else {
				return true;
			}
		});
};
