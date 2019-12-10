process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);

const knex = require('knex');
const connection = require('../db/connection'); // < knex connection client
const request = require('supertest');
const { app } = require('../app/app.js');

// const err = '\x1b[31m';
// const ok = '\x1b[32m';
// const _404 = '\x1b[33m';
const endpoint = '\x1b[45m';

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
	beforeEach(() => connection.seed.run());
	after(() => connection.destroy());

	describe(`${endpoint}/*`, () => {
		it(`/not/a/route	ERROR:404, Route not found`, () => {
			return request(app)
				.get('/not/a/route')
				.expect(404)
				.then(err => {
					expect(err.body.msg).to.equal('Route not found');
				});
		});
	});
	describe(`${endpoint}/api/topics`, () => {
		describe(`GET:200 - /`, () => {
			it('returns topics object', () => {
				return request(app)
					.get('/api/topics')
					.expect(200)
					.then(topics => {
						expect(topics.body).to.eql({
							topics: [
								{
									slug: 'mitch',
									description: 'The man, the Mitch, the legend'
								},
								{ slug: 'cats', description: 'Not dogs' },
								{ slug: 'paper', description: 'what books are made of' }
							]
						});
					});
			});
			it('all topics have correct keys', () => {
				return request(app)
					.get('/api/topics')
					.expect(200)
					.then(topics => {
						expect(topics.body).to.have.keys('topics');
						topics.body.topics.forEach(topic => {
							expect(topic).to.have.keys(['slug', 'description']);
						});
					});
			});
		});
		describe(`POST/PUT/PATCH/DELETE: 400 - method not allowed`, () => {
			it('does not allow other methods', () => {
				const badMethods = ['delete', 'post', 'put', 'patch'];
				const methodPromises = badMethods.map(method => {
					return request(app)
						[method]('/api/topics')
						.expect(400)
						.then(result => {
							expect(result.body.msg).to.equal(
								'BAD METHOD: Method not allowed on this endpoint'
							);
						});
				});
				return Promise.all(methodPromises);
			});
		});
	}); // << test order etc
	describe(`${endpoint}/api/users`, () => {
		describe('GET: 200 - /:username', () => {
			it('returns single user object', () => {
				return request(app)
					.get('/api/users/butter_bridge')
					.expect(200)
					.then(user => {
						expect(user.body).to.eql({
							user: {
								username: 'butter_bridge',
								name: 'jonny',
								avatar_url:
									'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
							}
						});
					});
			});
			it('user object has correct keys', () => {
				return request(app)
					.get('/api/users/butter_bridge')
					.expect(200)
					.then(user => {
						expect(user.body.user).to.have.keys(
							'username',
							'name',
							'avatar_url'
						);
					});
			});
		});
		describe('ERROR: 404 - /:username', () => {
			it('returns error when user not in database', () => {
				return request(app)
					.get(
						'/api/users/goblin6969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969699'
					)
					.expect(404)
					.then(err => {
						expect(err.body.msg).to.equal('User not found');
					});
			});
		});
		describe(`POST/PUT/PATCH/DELETE: 400 - method not allowed`, () => {
			it('does not allow other methods', () => {
				const badMethods = ['delete', 'post', 'put', 'patch'];
				const methodPromises = badMethods.map(method => {
					return request(app)
						[method]('/api/users/345')
						.expect(400)
						.then(result => {
							expect(result.body.msg).to.equal(
								'BAD METHOD: Method not allowed on this endpoint'
							);
						});
				});
				return Promise.all(methodPromises);
			});
		});
	});
	describe(`${endpoint}/api/articles`, () => {
		// ${endpoint}
		describe('GET 200 - /', () => {
			it('gets all articles with correct keys', () => {
				return request(app)
					.get('/api/articles')
					.expect(200)
					.then(articles => {
						expect(articles.body.articles.length).to.equal(12);
						articles.body.articles.forEach(article => {
							expect(article).to.have.keys(
								'article_id',
								'topic',
								'title',
								'author',
								'body',
								'created_at',
								'votes',
								'comment_count'
							);
						});
					});
			});
			it('default order is descending by date', () => {
				return request(app)
					.get('/api/articles')
					.expect(200)
					.then(articles => {
						expect(articles.body.articles).to.be.descendingBy('created_at');
					});
			});
		});
		xdescribe('GET 200 - ?sort_by=desc, ?order=title, ?author=doug, ?topic=food', () => {
			it('sort_by=asc/desc', () => {
				return request(app)
					.get('/api/articles?sort_by=asc')
					.expect(200)
					.then(articles => {
						expect(articles.body.articles).to.be.ascendingBy('created_at');
					});
			});
		});
		describe(`${endpoint}/api/articles/:article_id`, () => {
			describe('GET 200', () => {
				it('responds with correct article, with comment_count', () => {
					return request(app)
						.get('/api/articles/1')
						.expect(200)
						.then(article => {
							expect(article.body).to.eql({
								article: {
									article_id: 1,
									title: 'Living in the shadow of a great man',
									body: 'I find this existence challenging',
									votes: 100,
									topic: 'mitch',
									author: 'butter_bridge',
									created_at: '2018-11-15T12:21:54.171Z',
									comment_count: 13
								}
							});
						});
				});
			});
			describe('GET ERROR: 404', () => {
				it('responds with error when article_id not in db', () => {
					return request(app)
						.get('/api/articles/69')
						.expect(404)
						.then(err => {
							expect(err.body.msg).to.equal('Article not found');
						});
				});
				it('Correct error and code when non-number passed as parametric', () => {
					return request(app)
						.get('/api/articles/NinetySix')
						.expect(404)
						.then(err => {
							expect(err.body.msg).to.equal('Article not found');
						});
				});
			});
			describe('PATCH 200', () => {
				// << come back to after queries added for previous
				it('responds with updated article when passed inc_votes object', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({ inc_votes: 1 })
						.expect(200)
						.then(updatedArticle => {
							expect(updatedArticle.body.article.votes).to.equal(101);
						});
				});
				it('decrements score', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({ inc_votes: -1 })
						.expect(200)
						.then(updatedArticle => {
							expect(updatedArticle.body.article.votes).to.equal(99);
						});
				});
				it('decrements score below 0', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({ inc_votes: -1 })
						.expect(200)
						.then(updatedArticle => {
							expect(updatedArticle.body.article.votes).to.equal(-1);
						});
				});
			});
			describe('PATCH 400 - when given object doesnt conform to rules', () => {
				it('wrong increment type (non number)', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({ inc_votes: 'a million billion' })
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Patch request invalid');
						});
				});
				it('number too big', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({
							inc_votes: 69696969696969696969696969696969696969696969696969696969696969696969696969696969
						})
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Patch request invalid');
						});
				});
				it('number too anti-big', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({
							inc_votes: -69696969696969696969696969696969696969696969696969696969696969696969696969696969
						})
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Patch request invalid');
						});
				});
				it('ERR: 400 responds with correct error when article_id passed as string', () => {
					return request(app)
						.patch('/api/articles/my_fave_page')
						.send({ inc_votes: 1 })
						.expect(404)
						.then(err => {
							expect(err.body.msg).to.equal('Article not found');
						});
				});
				it('patch request has no body', () => {
					return request(app)
						.patch('/api/articles/2')
						.send()
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Patch request invalid');
						});
				});
				it('patch request object has no inc_votes', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({ pleaseUpTheVotesBy: 90, thank: 'you' })
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Patch request invalid');
						});
				});
			});
			describe('PATCH 404 - when article_id does not exist in db', () => {
				it('ERR: 404 responds with correct error type & message', () => {
					return request(app)
						.patch('/api/articles/9090')
						.send({ inc_votes: 1 })
						.expect(404)
						.then(err => {
							expect(err.body.msg).to.equal('Article not found');
						});
				});

				// it('ERR: 400 when patch made with 0', () => {
				// ???
				// });
			});
		});
	});
});

// Not yet complete								_
// Part worked on, come back later				/
// Plugged, endpoint reachable					✓
// Model sending back basic data				✓✓
// Basic Errors tested							✓✓✓
// Queries tested (if applicable)				✓✓✓✓
// Edge case error tested						✓✓✓✓✓
// complete										~★~

////////////////////////////////////////////
/////////// apiRouter :: /api /////////////			_
// GET ~ /										✓

////////////////////////////////////////////
////// topicRouter	:: /api/topics	///////			/
// GET ~ /
//-c :: getAllTopics							✓✓✓
//-m :: selectAllTopics							✓✓✓

/////////////////////////////////////////
/////// userRouter :: /api/users ///////			/
// GET ~ /:username
//-c :: getUserById 							✓✓✓
//-m :: selectUserById 							✓✓✓

///////////////////////////////////////////
//// articleRouter :: /api/articles  /////		_
// GET ~ /
//-c :: getAllArticles							✓✓✓
//-m :: selectAllArticles						✓✓✓
//-------------
// GET ~ /:article_id
//-c :: getArticleById							✓✓✓
//-m :: selectArticleById						✓✓✓
// PATCH ~ /:article_id
//-c :: patchArticleById						✓
//-m :: updateArticeById						✓
//-------------
// POST ~ /:article_id/comments
//-c :: postComment								✓
//-m :: insertComment							✓
// GET ~ /:article-id/comments
//-c :: getArticleById							✓
//-m :: selectArticleById						✓

/////////////////////////////////////////
//// commentRouter :: /api/comments ////		_
// PATCH ~ /:comment_id							_
// DELETE ~/:comment_id
