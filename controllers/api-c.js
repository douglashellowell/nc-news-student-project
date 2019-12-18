const endpointsJSON = require('../endpoints.json');

exports.serveApiJson = (req, res, next) => {
	res.status(200).send(endpointsJSON);
};
