const readJson = require('../models/api-m.js');

exports.serveApiJson = (req, res, next) => {
	console.log('in serveApiJson controller');
	readJson()
		.then(jsonFile => {
			res.status(200).send(jsonFile);
		})
		.catch(err => {
			res.status(500).send({ msg: 'Api not found' });
		});
};
