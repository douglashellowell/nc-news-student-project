const connection = require('../db/connection');

const selectAllTopics = () => {
	return connection
		.select('*')
		.from('topics')
		.then(topics => {
			return topics;
		});
};

const insertTopic = body => {
	return connection
		.returning('*')
		.insert(body)
		.into('topics')
		.then(([topic]) => {
			return topic;
		});
};

module.exports = { selectAllTopics, insertTopic };
