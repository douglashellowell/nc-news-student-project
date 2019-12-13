const endpointsJSON = require('../endpoints.json');

exports.serveApiJson = (req, res, next) => {
	console.log('in serveAPIJSON enpoint');
	res.status(200).send(endpointsJSON);
};
