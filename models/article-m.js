const connection = require('../db/connection');
const { isLegalNumber } = require('../db/utils/utils');
const { checkExists } = require('../models/database_util-m');

const selectAllArticles = (
	sort_by = 'created_at',
	order = 'desc',
	author,
	topic,
	page = 1,
	limit = 10
) => {
	return connection
		.select(
			'articles.author',
			'articles.title',
			'articles.article_id',
			'articles.created_at',
			'articles.votes',
			'articles.topic'
		)
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.modify(query => {
			if (author) query.where('articles.author', '=', author);
			if (topic) query.where('articles.topic', '=', topic);
		})
		.limit(limit)
		.offset(page * limit - limit)
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.orderBy(sort_by, order)
		.groupBy('articles.article_id')
		.then(articles => {
			if (articles.length) return [articles];
			else {
				let table, column, value;
				if (author) {
					table = 'users';
					column = 'username';
					value = author;
				} else if (topic) {
					table = 'topics';
					column = 'slug';
					value = topic;
				}

				return Promise.all([articles, checkExists(table, column, value)]);
			}
		})
		.then(([articles, filterExists]) => {
			if (articles) return articles;
			if (filterExists) return [];
			return Promise.reject({ status: 404, msg: 'No articles in database' });
		});
};

const selectCommentsById = (
	article_id,
	sort_by = 'created_at',
	order = 'desc',
	page = 1,
	limit = 10
) => {
	return connection
		.select('*')
		.from('comments')
		.where('article_id', article_id)
		.orderBy(sort_by, order)
		.limit(limit)
		.offset(page * limit - limit)
		.then(comments => {
			if (comments.length) return [comments];
			else {
				return Promise.all([
					false,
					checkExists('articles', 'article_id', article_id)
				]);
			}
		})
		.then(([comments, articleExists]) => {
			if (comments) return comments;
			if (articleExists) return [];
		});
};

const insertComment = (article_id, comment) => {
	if (comment.body === '' || !comment.body) {
		return Promise.reject({ status: 400, msg: 'Invalid post request' });
	}
	const toInsert = {
		author: comment.username,
		article_id: article_id,
		body: comment.body
	};
	return connection
		.returning('*')
		.insert(toInsert)
		.into('comments')
		.then(([comment]) => {
			return comment;
		});
};

const selectArticleById = article_id => {
	return connection
		.select('articles.*')
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.where('articles.article_id', article_id)
		.groupBy('articles.article_id')
		.then(article => {
			if (!article.length)
				return Promise.reject({ status: 404, msg: 'Article not found' });
			else {
				const { comment_count, ...rest } = article[0];
				return { comment_count: comment_count, ...rest };
			}
		});
};

const updateArticleById = (article_id, inc_votes = 0) => {
	if (isLegalNumber(inc_votes)) {
		return connection
			.increment('votes', inc_votes)
			.from('articles')
			.where('article_id', article_id)
			.returning('*')
			.then(([article]) => {
				if (!article)
					return Promise.reject({ status: 404, msg: 'Article not found' });
				else return article;
			});
	} else {
		return Promise.reject({ status: 400, msg: 'Patch request invalid' });
	}
};

const insertArticle = article => {
	if (!Object.keys(article).length)
		return Promise.reject({ status: 400, msg: 'No article data sent' });
	if (article.body.trim() === '' || article.title.trim() === '')
		return Promise.reject({ status: 400, msg: 'Cannot post a blank field' });
	return connection
		.returning('*')
		.insert(article)
		.into('articles')
		.then(([article]) => {
			return article;
		});
};

const destroyArticle = article_id => {
	return connection
		.from('articles')
		.where('article_id', article_id)
		.del()
		.then(response => {
			if (!response)
				return Promise.reject({ status: 404, msg: 'Article not found' });
		});
};

module.exports = {
	selectAllArticles,
	selectCommentsById,
	insertComment,
	selectArticleById,
	updateArticleById,
	insertArticle,
	destroyArticle
};
