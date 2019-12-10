const connection = require('../../db/connection');
const { applyCount, isLegalNumber } = require('../../db/utils/utils');

const selectAllArticles = (
	sort_by = 'created_at',
	order = 'desc',
	author,
	topic,
	invalid
) => {
	console.log('in selectAllArticles model!');
	console.log(sort_by);

	return connection
		.select('articles.*')
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.groupBy('articles.article_id')
		.orderBy(sort_by, order)
		.then(articles => {
			// console.log(articles);
			return { articles };
		});
	// 	Should accept queries
	// .orderBy(sort_by, order)
	// .modify(query => {
	// 	if (colour) return query.where('colour', '=', colour);
	// })
	// .modify(query => {
	// 	if (treasure_name)
	// 		return query.where('treasure_name', '=', treasure_name);
	// })
	// .modify(query => {
	// 	if (age) return query.where('age', '=', age);
	// })
	// .modify(query => {
	// 	if (cost_at_auction)
	// 		return query.where('cost_at_auction', '=', cost_at_auction);
	// })
	// .modify(query => {
	// 	if (shop_name) return query.where('shop_name', '=', shop_name);
	// })
	// sort_by, sorts the articles by any valid column (default-date)
	// order, 	asc / desc (default-desc)
	// author, 	filters by the username
	// topic, 	filters by the topic
};

// const selectCommentById = () => {
// 	// console.log('in selectCommentById model!');
// };

// const insertComment = () => {
// 	// console.log('in insertComment model!');
// };

const selectArticleById = article_id => {
	console.log('in selectArticleById model!');
	return connection
		.select('articles.*')
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.where('articles.article_id', article_id)
		.groupBy('articles.article_id')
		.then(([{ comment_count, ...rest }]) => {
			// console.log(articles);
			return {
				article: {
					comment_count: +comment_count,
					...rest
				}
			};
		});
};

const updateArticleById = (article_id, inc_votes) => {
	if (isNaN(+article_id)) {
		return Promise.reject({
			status: 404,
			msg: 'Article not found'
		});
	} else {
		// This model doesn't accept inc_votes > 500 - check isLegalNumber
		console.log('in updateArticleById model!', inc_votes);
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
	// selectCommentById,
	// insertComment,
	selectArticleById,
	updateArticleById
};
