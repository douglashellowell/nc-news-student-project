const connection = require('../../db/connection');

const selectAllTopics = () => {
	console.log('in selectAllTopics model!');
	return connection
		.select('*')
		.from('topics')
		.then(topics => {
			// console.log('sending :', topics);
			return {
				topics: topics
			};
		});
};

module.exports = { selectAllTopics };
