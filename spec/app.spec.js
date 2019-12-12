process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);

const knex = require('knex');
const connection = require('../db/connection'); // < knex connection client
const request = require('supertest');
const { app } = require('../app.js');

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
		it(`ERROR:404, Route not found (/not/a/route)`, () => {
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
			it('200 - returns topics object', () => {
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
			it('200 - all topics have correct keys', () => {
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
		describe(`POST/PUT/PATCH/DELETE: 405 - method not allowed`, () => {
			it('405 - does not allow other methods', () => {
				const badMethods = ['delete', 'post', 'put', 'patch'];
				const methodPromises = badMethods.map(method => {
					return request(app)
						[method]('/api/topics')
						.expect(405)
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
			it('200 - returns single user object', () => {
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
			it('200 - user object has correct keys', () => {
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
			it('404 - returns error when user not in database', () => {
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
		describe(`POST/PUT/PATCH/DELETE: 405 - method not allowed`, () => {
			it('405 - does not allow other methods', () => {
				const badMethods = ['delete', 'post', 'put', 'patch'];
				const methodPromises = badMethods.map(method => {
					return request(app)
						[method]('/api/users/345')
						.expect(405)
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
			it('200 - gets all articles with correct keys', () => {
				return request(app)
					.get('/api/articles')
					.expect(200)
					.then(response => {
						expect(response.body.articles.length).to.equal(12);
						response.body.articles.forEach(article => {
							expect(article).to.have.keys(
								'article_id',
								'topic',
								'title',
								'author',
								'created_at',
								'votes',
								'comment_count'
							);
						});
					});
			});
			it('200 - default order is descending by date', () => {
				return request(app)
					.get('/api/articles')
					.expect(200)
					.then(response => {
						expect(response.body.articles).to.be.descendingBy('created_at');
					});
			});
		});
		describe('GET - Queries', () => {
			it('200 - ?order=asc returns ascending by created_at', () => {
				return request(app)
					.get('/api/articles?order=asc')
					.expect(200)
					.then(response => {
						expect(response.body.articles).to.be.ascendingBy('created_at');
					});
			});
			it('200 - ?sort_by=title', () => {
				return request(app)
					.get('/api/articles?sort_by=title')
					.expect(200)
					.then(response => {
						expect(response.body.articles).to.be.descendingBy('title');
					});
			});
			it('400 - ?sort_by=column_not_in_database', () => {
				return request(app)
					.get('/api/articles?sort_by=column_not_in_database')
					.expect(400)
					.then(response => {
						const { msg } = response.body;
						expect(msg).to.equal('Column does not exist');
					});
			});
			it('200 - ?sort_by=topic&order=desc', () => {
				return request(app)
					.get('/api/articles?sort_by=topic&order=asc')
					.expect(200)
					.then(response => {
						expect(response.body.articles).to.be.ascendingBy('topic');
					});
			});
			describe('?column=property', () => {
				it('200 - ?author=rogersop (in database, with content)', () => {
					return request(app)
						.get('/api/articles?author=rogersop')
						.expect(200)
						.then(response => {
							expect(response.body.articles.length).to.equal(3);
						});
				});
				it('404 - ?author=notInDatabase(not in database)', () => {
					return request(app)
						.get('/api/articles?author=imNotInDatabase ')
						.expect(404)
						.then(response => {
							expect(response.body.msg).to.equal('users content not found');
						});
				});
				it('200 - ?author=lurker (in database but has no articles)', () => {
					return request(app)
						.get('/api/articles?author=lurker')
						.expect(200)
						.then(response => {
							expect(response.body.articles).to.eql([]);
						});
				});
				it('200 - ?topic=cats (valid topic with content)', () => {
					return request(app)
						.get('/api/articles?topic=cats')
						.expect(200)
						.then(response => {
							expect(response.body.articles).to.have.lengthOf(1);
						});
				});
				it('404 - ?topic=missingTopic (not in database)', () => {
					return request(app)
						.get('/api/articles?topic=missingTopic')
						.expect(404)
						.then(response => {
							expect(response.body.msg).to.equal('topics content not found');
						});
				});
				it('200 - ?topic=paper (in database but has no articles)', () => {
					return request(app)
						.get('/api/articles?topic=paper')
						.expect(200)
						.then(response => {
							expect(response.body.articles).to.eql([]);
						});
				});
				it('400 - ?garbage=request (column does not exist/request invalid)', () => {
					return request(app)
						.get('/api/articles?garbage=request')
						.expect(400)
						.then(response => {
							expect(response.body.msg).to.equal('Query invalid');
						});
				});
				it('200 - ?topic=mitch&author=icellusedkars (valid chained queries with content)', () => {
					return request(app)
						.get('/api/articles?topic=mitch&author=icellusedkars')
						.expect(200)
						.then(response => {
							expect(response.body.articles).to.have.lengthOf(6);
						});
				});
				it('200 - ?topic=mitch&author=lurker (valid chained queries with no content - "author" has no articles in topic )', () => {
					return request(app)
						.get('/api/articles?topic=mitch&author=lurker')
						.expect(200)
						.then(response => {
							expect(response.body.articles).to.eql([]);
						});
				});
				it('200 - ?topic=mitch&funny=true (chained queries with one invalid)', () => {
					return request(app)
						.get('/api/articles?topic=mitch&funny=true')
						.expect(400)
						.then(response => {
							expect(response.body.msg).to.equal('Query invalid');
						});
				});
			});
		});
		describe('POST/PUT/PATCH/DELETE: 405 - method not allowed', () => {
			it('405 - does not allow other methods', () => {
				const badMethods = ['delete', 'post', 'put', 'patch'];
				const methodPromises = badMethods.map(method => {
					return request(app)
						[method]('/api/articles')
						.expect(405)
						.then(result => {
							expect(result.body.msg).to.equal(
								'BAD METHOD: Method not allowed on this endpoint'
							);
						});
				});
				return Promise.all(methodPromises);
			});
		});
		describe(`${endpoint}/api/articles/:article_id`, () => {
			describe('GET 200', () => {
				it('200 - responds with correct article, with comment_count', () => {
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
									comment_count: '13'
								}
							});
						});
				});
			});
			describe('GET ERROR: 404/400', () => {
				it('404 - responds with error when article_id not in db', () => {
					return request(app)
						.get('/api/articles/69')
						.expect(404)
						.then(err => {
							expect(err.body.msg).to.equal('Article not found');
						});
				});
				it('400 - Correct error and 400code when non-number passed as parametric', () => {
					return request(app)
						.get('/api/articles/NinetySix')
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Invalid input syntax');
						});
				});
			});
			describe('PATCH 200', () => {
				// << come back to after queries added for previous
				it('200 - responds with updated article when passed inc_votes object', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({ inc_votes: 1 })
						.expect(200)
						.then(updatedArticle => {
							expect(updatedArticle.body.article.votes).to.equal(101);
						});
				});
				it('200 - decrements score', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({ inc_votes: -1 })
						.expect(200)
						.then(updatedArticle => {
							expect(updatedArticle.body.article.votes).to.equal(99);
						});
				});
				it('200 - decrements score below 0', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({ inc_votes: -1 })
						.expect(200)
						.then(updatedArticle => {
							expect(updatedArticle.body.article.votes).to.equal(-1);
						});
				});
				it('200 - patch request has no body - no votes cast', () => {
					return request(app)
						.patch('/api/articles/2')
						.send()
						.expect(200)
						.then(updatedArticle => {
							expect(updatedArticle.body.article.votes).to.equal(0);
						});
				});
			});
			describe('PATCH 400 - when given object doesnt conform to rules', () => {
				it('400 - wrong increment type (non number)', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({ inc_votes: 'a million billion' })
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Patch request invalid');
						});
				});
				it('400 - number too big', () => {
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
				it('400 - number too anti-big', () => {
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
				it('400 - article_id passed as string', () => {
					return request(app)
						.patch('/api/articles/my_fave_page')
						.send({ inc_votes: 1 })
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Invalid input syntax');
						});
				});

				it('400 - patch request object has no inc_votes', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({ pleaseUpTheVotesBy: 90, thank: 'you' })
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Patch request invalid');
						});
				});
				it('400 - patch request has uneccassary values', () => {
					return request(app)
						.patch('/api/articles/2')
						.send({ inc_votes: 2, thank: 'you' })
						.expect(400)
						.then(err => {
							expect(err.body.msg).to.equal('Patch request invalid');
						});
				});
			});
			describe('PATCH 404 - when article_id does not exist in db', () => {
				it('404 - responds with correct error type & message', () => {
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
			describe('POST/PUT/DELETE: 405 - method not allowed', () => {
				it('405 - does not allow other methods', () => {
					const badMethods = ['delete', 'post', 'put'];
					const methodPromises = badMethods.map(method => {
						return request(app)
							[method]('/api/articles/1')
							.expect(405)
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
		describe(`${endpoint}/api/articles/:article_id/comments`, () => {
			describe('GET ', () => {
				it('200 - responds with comment array of corresponding article with valid keys', () => {
					return request(app)
						.get('/api/articles/5/comments')
						.expect(200)
						.then(response => {
							const { comments } = response.body;
							expect(comments).to.have.lengthOf(2);
							expect(comments[0]).to.have.keys(
								'comment_id',
								'votes',
								'created_at',
								'author',
								'body',
								'article_id'
							);
						});
				});
				it('200 - responds with empty array if article exists but no comment content', () => {
					return request(app)
						.get('/api/articles/2/comments')
						.expect(200)
						.then(response => {
							const { comments } = response.body;
							expect(comments).to.have.lengthOf(0);
						});
				});
				it('404 - when article_id not in database', () => {
					return request(app)
						.get('/api/articles/9001/comments')
						.expect(404)
						.then(response => {
							const { msg } = response.body;
							expect(msg).to.equal('Article not found');
						});
				});
				it('400 - article_id invalid', () => {
					return request(app)
						.get('/api/articles/douglas/comments')
						.expect(400)
						.then(response => {
							const { msg } = response.body;
							expect(msg).to.equal('Invalid input syntax');
						});
				});
				describe('Queries', () => {
					it('defaults to ?sort_by:created_at&order=desc', () => {
						return request(app)
							.get('/api/articles/5/comments')
							.expect(200)
							.then(response => {
								const { comments } = response.body;
								expect(comments).to.be.descendingBy('created_at');
							});
					});
					it('400 - Invalid search query (/api/articles/2/comments?gossip=true)', () => {
						return request(app)
							.get('/api/articles/3/comments?gossip=true')
							.expect(400)
							.then(response => {
								const { msg } = response.body;
								expect(msg).to.equal('Invalid input syntax');
							});
					});
					it('200 sort_by=votes - (w/ default order=desc)', () => {
						return request(app)
							.get('/api/articles/5/comments?sort_by=votes')
							.expect(200)
							.then(response => {
								const { comments } = response.body;
								expect(comments).to.be.descendingBy('votes');
							});
					});
					it('200 order=asc - (w/ default sort_by=created_at)', () => {
						return request(app)
							.get('/api/articles/5/comments?order=asc')
							.expect(200)
							.then(response => {
								const { comments } = response.body;
								expect(comments).to.be.ascendingBy('created_at');
							});
					});
					it('400 sort_by=not_a_column', () => {
						return request(app)
							.get('/api/articles/3/comments?sort_by=not_a_column')
							.expect(400)
							.then(response => {
								const { msg } = response.body;
								expect(msg).to.equal('Column does not exist');
							});
					});
				});
			});
			describe('POST', () => {
				it('201 - successful valid post', () => {
					return request(app)
						.post('/api/articles/2/comments')
						.send({
							username: 'icellusedkars',
							body: 'This article is interesting!'
						})
						.expect(201)
						.then(response => {
							// console.log('complete!');
							const { comment } = response.body;
							expect(comment).to.have.keys(
								'body',
								'article_id',
								'author',
								'comment_id',
								'created_at',
								'votes'
							);
						});
				});
				it('400 - when user does not exist', () => {
					return request(app)
						.post('/api/articles/2/comments')
						.send({
							username: 'doug',
							body: 'I do not have an account!'
						})
						.expect(400)
						.then(response => {
							const { msg } = response.body;
							expect(msg).to.equal('Target does not exist in database');
						});
				});
				it('400 - when post contains no content', () => {
					return request(app)
						.post('/api/articles/2/comments')
						.send({ username: 'icellusedkars', body: '' })
						.expect(400)
						.then(response => {
							const { msg } = response.body;
							expect(msg).to.equal('Invalid post request');
						});
				});
				it('400 - when comment body information missing', () => {
					return request(app)
						.post('/api/articles/2/comments')
						.send({ username: 'icellusedkars' })
						.expect(400)
						.then(response => {
							const { msg } = response.body;
							expect(msg).to.equal('Invalid post request');
						});
				});
				it('400 - when username information missing', () => {
					return request(app)
						.post('/api/articles/2/comments')
						.send({ body: 'wooppeeeeee' })
						.expect(400)
						.then(response => {
							const { msg } = response.body;
							expect(msg).to.equal('Invalid post request');
						});
				});
				it('400 - when article_id passed as string', () => {
					return request(app)
						.post('/api/articles/important_story/comments')
						.send({ username: 'icellusedkars', body: 'wooppeeeeee' })
						.expect(400)
						.then(response => {
							const { msg } = response.body;
							expect(msg).to.equal('Invalid input syntax');
						});
				});
				it('400 - when article does not exist', () => {
					return request(app)
						.post('/api/articles/666999/comments')
						.send({
							username: 'icellusedkars',
							body: 'This article is interesting!'
						})
						.expect(400)
						.then(response => {
							const { msg } = response.body;
							expect(msg).to.equal('Target does not exist in database');
						});
				});
			});
			describe('PUT/PATCH/DELETE: 405 - method not allowed', () => {
				it('405 - does not allow other methods', () => {
					const badMethods = ['delete', 'put', 'patch'];
					const methodPromises = badMethods.map(method => {
						return request(app)
							[method]('/api/articles/1/comments')
							.expect(405)
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
	});
	describe(`${endpoint}/api/comments/:comment_id`, () => {
		describe('POST/PUT/GET: 405 - method not allowed', () => {
			it('405 - does not allow other methods', () => {
				const badMethods = ['get', 'post', 'put'];
				const methodPromises = badMethods.map(method => {
					return request(app)
						[method]('/api/comments/2')
						.expect(405)
						.then(result => {
							expect(result.body.msg).to.equal(
								'BAD METHOD: Method not allowed on this endpoint'
							);
						});
				});
				return Promise.all(methodPromises);
			});
		});
		describe('PATCH 200', () => {
			it('200 - successfully updates comment score with inc_votes object', () => {
				return request(app)
					.patch('/api/comments/1')
					.send({ inc_votes: 1 })
					.expect(200)
					.then(response => {
						expect(response.body.comment.votes).to.equal(17);
					});
			});
			it('200 - decrements score', () => {
				return request(app)
					.patch('/api/comments/1')
					.send({ inc_votes: -1 })
					.expect(200)
					.then(response => {
						expect(response.body.comment.votes).to.equal(15);
					});
			});

			it('200 - patch request has no body, no votes cast', () => {
				return request(app)
					.patch('/api/comments/1')
					.send()
					.expect(200)
					.then(response => {
						expect(response.body.comment.votes).to.equal(16);
					});
			});
		});
		describe('PATCH 400 - when given object doesnt conform to rules', () => {
			it('404 - When comment_id is not in database', () => {
				return request(app)
					.patch('/api/comments/666999')
					.send({
						inc_votes: 2
					})
					.expect(404)
					.then(response => {
						expect(response.body.msg).to.equal('Comment not found');
					});
			});
			it('400 - wrong increment type (non number)', () => {
				return request(app)
					.patch('/api/comments/2')
					.send({ inc_votes: 'a million billion' })
					.expect(400)
					.then(response => {
						expect(response.body.msg).to.equal('Patch request invalid');
					});
			});
			it('400 - number too big', () => {
				return request(app)
					.patch('/api/comments/2')
					.send({
						inc_votes: 69696969696969696969696969696969696969696969696969696969696969696969696969696969
					})
					.expect(400)
					.then(response => {
						expect(response.body.msg).to.equal('Patch request invalid');
					});
			});
			it('400 - number too anti-big', () => {
				return request(app)
					.patch('/api/comments/2')
					.send({
						inc_votes: -69696969696969696969696969696969696969696969696969696969696969696969696969696969
					})
					.expect(400)
					.then(response => {
						expect(response.body.msg).to.equal('Patch request invalid');
					});
			});
			it('400 - article_id passed as string', () => {
				return request(app)
					.patch('/api/comments/my_fave_page')
					.send({ inc_votes: 1 })
					.expect(400)
					.then(response => {
						expect(response.body.msg).to.equal('Invalid input syntax');
					});
			});
			it('400 - patch request object has no inc_votes', () => {
				return request(app)
					.patch('/api/comments/2')
					.send({ pleaseUpTheVotesBy: 90, thank: 'you' })
					.expect(400)
					.then(response => {
						expect(response.body.msg).to.equal('Patch request invalid');
					});
			});
			it('400 - patch request has uneccassary values', () => {
				return request(app)
					.patch('/api/comments/2')
					.send({ inc_votes: 2, thank: 'you' })
					.expect(400)
					.then(response => {
						expect(response.body.msg).to.equal('Patch request invalid');
					});
			});
		});
		describe('DELETE 204', () => {
			it('204 - successfuly deletes a comment and returns a 204', () => {
				return request(app)
					.delete('/api/comments/14')
					.expect(204)
					.then(() => {
						return request(app)
							.get('/api/articles/5/comments')
							.expect(200);
					})
					.then(response => {
						const { comments } = response.body;
						expect(comments).to.have.lengthOf(1);
					});
			});
		});
		describe('DELETE 400', () => {
			it('400 - comment_id not in database', () => {
				return request(app)
					.delete('/api/comments/5555')
					.expect(404)
					.then(response => {
						const { msg } = response.body;
						expect(msg).to.equal('Comment not found');
					});
			});
			it('400 - comment_id passed as string', () => {
				return request(app)
					.delete('/api/comments/bloopy')
					.expect(400)
					.then(response => {
						const { msg } = response.body;
						expect(msg).to.equal('Invalid input syntax');
					});
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
//-c :: getAllTopics							✓✓
//-m :: selectAllTopics							✓✓

/////////////////////////////////////////
/////// userRouter :: /api/users ///////			/
// GET ~ /:username
//-c :: getUserById 							✓✓✓
//-m :: selectUserById 							✓✓✓

///////////////////////////////////////////
//// articleRouter :: /api/articles  /////		_
// GET ~ /
//-c :: getAllArticles							✓✓✓✓
//-m :: selectAllArticles						✓✓✓✓
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
