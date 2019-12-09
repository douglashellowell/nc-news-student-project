const {
	selectAllArticles,
	selectCommentById,
	insertComment,
	selectArticleById,
	updateArticleById
} = require('../models/article-m.js');

exports.getAllArticles = (req, res, next) => {
	console.log('in getAllArticles controller!');
	selectAllArticles()
		.then(articles => {
			res.status(200).send(articles);
		})
		.catch(err => {
			next(err);
		});
};

exports.getComment = (req, res, next) => {
	console.log('in getComment controller!');
	selectCommentById()
		.then(comment => {
			res.status(200).send(comment);
		})
		.catch(err => {
			next(err);
		});
};

exports.postComment = (req, res, next) => {
	console.log('in postcomment controller!');
	insertComment()
		.then(comment => {
			res.status(200).send(comment);
		})
		.catch(err => {
			next(err);
		});
};

exports.getArticleById = (req, res, next) => {
	console.log('in getArticleById controller!');
	selectArticleById()
		.then(article => {
			res.status(200).send(article);
		})
		.catch(err => {
			next(err);
		});
};

exports.patchArticleById = (req, res, next) => {
	console.log('in patchArticleById controller!');
	updateArticleById()
		.then(article => {
			res.status(200).send(article);
		})
		.catch(err => {
			next(err);
		});
};
