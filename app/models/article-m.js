const connection = require('../../db/connection');
const { isLegalNumber } = require('../../db/utils/utils');

const selectAllArticles = (
	sort_by = 'created_at',
	order = 'desc',
	author,
	topic,
	invalid
) => {
	if (Object.keys(invalid).length) {
		return Promise.reject({ status: 400, msg: 'Query invalid' });
	} else {
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
			})
			.modify(query => {
				if (topic) query.where('articles.topic', '=', topic);
			})
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
					const queryPromise = connection
						.select(column)
						.from(table)
						.where(column, value);
					return Promise.all([articles, queryPromise, table]);
				}
			})
			.then(([articles, query, table]) => {
				if (query === undefined || query.length) return { articles: articles };
				else {
					return Promise.reject({
						status: 404,
						msg: `${table} content not found`
					});
				}
			});
	}
};

const selectCommentsById = (
	article_id,
	sort_by = 'created_at',
	order = 'desc',
	invalid
) => {
	if (Object.keys(invalid).length) {
		return Promise.reject({ status: 400, msg: 'Invalid input syntax' });
	}
	return connection
		.select('*')
		.from('comments')
		.where('article_id', article_id)
		.orderBy(sort_by, order)
		.then(comments => {
			if (comments.length) return [comments];
			else {
				const articlePromise = connection
					.select('article_id')
					.from('articles')
					.where('article_id', article_id);
				return Promise.all([comments, articlePromise]);
			}
		})
		.then(([comments, article]) => {
			if (article === undefined || article.length)
				return { comments: comments };
			else return Promise.reject({ status: 404, msg: 'Article not found' });
		});
};

const insertComment = (article_id, comment) => {
	if (comment.body === '' || !comment.body || !comment.username) {
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
			return { comment };
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
				return { article: { comment_count: comment_count, ...rest } };
			}
		});
};

const updateArticleById = (article_id, inc_votes = 0, invalid) => {
	if (Object.keys(invalid).length) {
		return Promise.reject({ status: 400, msg: 'Patch request invalid' });
	} else {
		if (isLegalNumber(inc_votes)) {
			return connection
				.increment('votes', inc_votes)
				.from('articles')
				.where('article_id', article_id)
				.returning('*')
				.then(([article]) => {
					if (!article)
						return Promise.reject({ status: 404, msg: 'Article not found' });
					else return { article };
				});
		} else {
			return Promise.reject({ status: 400, msg: 'Patch request invalid' });
		}
	}
};

module.exports = {
	selectAllArticles,
	selectCommentsById,
	insertComment,
	selectArticleById,
	updateArticleById
};
