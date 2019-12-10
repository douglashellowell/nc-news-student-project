const { selectAllTopics } = require('../models/topic-m.js');

exports.getAllTopics = (req, res, next) => {
	// console.log('in getAllTopics controller!');

	selectAllTopics()
		.then(topics => {
			res.status(200).send(topics);
		})
		.catch(err => {
			next(err);
		});
};
