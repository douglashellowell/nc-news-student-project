const connection = require('../db/connection');

const selectAllTopics = () => {
	return connection
		.select('*')
		.from('topics')
		.then(topics => {
			return {
				topics: topics
			};
		});
};

module.exports = { selectAllTopics };
