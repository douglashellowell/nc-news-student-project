const fs = require('fs');

const readJson = () => {
	console.log('in readjson model');
	return new Promise((resolve, reject) => {
		fs.readFile('./endpoints.json', 'utf8', (err, data) => {
			if (err) reject(err);
			else {
				const json = JSON.parse(data);
				resolve(json);
			}
		});
	});
};

module.exports = readJson;
