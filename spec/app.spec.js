process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const knex = require('knex');
const connection = require('../db/connection'); // < knex connection client
const request = require('supertest');
const { app } = require('../app/app.js');

console.log(
	'\n',
	'\x1b[7m',
	`NODE_ENV = ${
		process.env.NODE_ENV === 'test'
			? 'test, using test DB'
			: 'undefined, using development DB'
	}`,
	'\x1b[7m'
);

describe('==== app ====', () => {
	after(() => connection.destroy());
	describe('/*', () => {
		it('/not/a/route	ERROR:404, Route not found', () => {
			return request(app)
				.get('/not/a/route')
				.expect(404)
				.then(err => {
					expect(err.body.msg).to.equal('Route not found');
				});
		});
	});

	describe('/api/topics', () => {
		it('GET:200 - returns all topics in correct format', () => {
			return request(app)
				.get('/api/topics')
				.expect(200)
				.then(topics => {
					expect(topics.body.topics).to.eql({});
				});
		});
	});
});
