const ENV = process.env.NODE_ENV || 'development';

const testData = require('./test-data/index.js');
const devData = require('./development-data/index.js');

const data = {
	test: testData,
	development: devData
};

module.exports = data[ENV];
