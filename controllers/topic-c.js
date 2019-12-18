const { selectAllTopics, insertTopic } = require('../models/topic-m.js');

exports.getAllTopics = (req, res, next) => {
	selectAllTopics()
		.then(topics => {
			res.status(200).send({ topics });
		})
		.catch(err => {
			next(err);
		});
};

exports.postTopic = (req, res, next) => {
	const { body } = req;
	insertTopic(body)
		.then(topic => {
			res.status(201).send({ topic });
		})
		.catch(err => {
			next(err);
		});
};
