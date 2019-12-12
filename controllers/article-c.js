const {
	selectAllArticles,
	selectCommentsById,
	insertComment,
	selectArticleById,
	updateArticleById
} = require('../models/article-m.js');

exports.getAllArticles = (req, res, next) => {
	const { sort_by, order, author, topic, ...invalid } = req.query;
	selectAllArticles(sort_by, order, author, topic, invalid)
		.then(articles => {
			res.status(200).send(articles);
		})
		.catch(err => {
			next(err);
		});
};

exports.getComments = (req, res, next) => {
	const { article_id } = req.params;
	const { sort_by, order, ...invalid } = req.query;
	selectCommentsById(article_id, sort_by, order, invalid)
		.then(comment => {
			res.status(200).send(comment);
		})
		.catch(err => {
			next(err);
		});
};

exports.postComment = (req, res, next) => {
	const { body } = req;
	const { article_id } = req.params;
	insertComment(article_id, body)
		.then(comment => {
			res.status(201).send(comment);
		})
		.catch(err => {
			next(err);
		});
};

exports.getArticleById = (req, res, next) => {
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
	const { article_id } = req.params;
	const { inc_votes, ...invalid } = req.body;
	updateArticleById(article_id, inc_votes, invalid)
		.then(article => {
			res.status(200).send(article);
		})
		.catch(err => {
			next(err);
		});
};
