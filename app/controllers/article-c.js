const {
	selectAllArticles,
	selectCommentById,
	insertComment,
	selectArticleById,
	updateArticleById
} = require('../models/article-m.js');

exports.getAllArticles = (req, res, next) => {
	console.log('in getAllArticles controller!');
	const { sort_by, order, author, topic, ...invalid } = req.query;
	selectAllArticles(sort_by, order, author, topic, invalid)
		.then(articles => {
			res.status(200).send(articles);
		})
		.catch(err => {
			next(err);
		});
};

// exports.getComment = (req, res, next) => {
// 	// console.log('in getComment controller!');
// 	selectCommentById()
// 		.then(comment => {
// 			res.status(200).send(comment);
// 		})
// 		.catch(err => {
// 			next(err);
// 		});
// };

// exports.postComment = (req, res, next) => {
// 	// console.log('in postcomment controller!');
// 	insertComment()
// 		.then(comment => {
// 			res.status(200).send(comment);
// 		})
// 		.catch(err => {
// 			next(err);
// 		});
// };

exports.getArticleById = (req, res, next) => {
	console.log('in getArticleById controller!');
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then(article => {
			res.status(200).send(article);
		})
		.catch(err => {
			next(err);
		});
};

exports.patchArticleById = (req, res, next) => {
	console.log('in patchArticleById controller!');
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	updateArticleById(article_id, inc_votes)
		.then(article => {
			res.status(200).send(article);
		})
		.catch(err => {
			next(err);
		});
};
