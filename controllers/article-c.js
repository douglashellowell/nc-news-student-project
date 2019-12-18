const {
	selectAllArticles,
	selectCommentsById,
	insertComment,
	selectArticleById,
	updateArticleById,
	insertArticle,
	destroyArticle
} = require('../models/article-m.js');

exports.getAllArticles = (req, res, next) => {
	const { sort_by, order, author, topic, page, limit, ...invalid } = req.query;
	if (Object.keys(invalid).length) next({ status: 400, msg: 'Query invalid' });
	selectAllArticles(sort_by, order, author, topic, page, limit)
		.then(articles => {
			res.status(200).send({ articles });
		})
		.catch(err => {
			next(err);
		});
};

exports.getComments = (req, res, next) => {
	const { article_id } = req.params;
	const { sort_by, order, page, limit, ...invalid } = req.query;
	if (Object.keys(invalid).length) next({ status: 400, msg: 'Query invalid' });
	selectCommentsById(article_id, sort_by, order, page, limit)
		.then(comments => {
			res.status(200).send({ comments });
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
			res.status(201).send({ comment });
		})
		.catch(err => {
			next(err);
		});
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then(article => {
			res.status(200).send({ article });
		})
		.catch(err => {
			next(err);
		});
};

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes, ...invalid } = req.body;
	if (Object.keys(invalid).length)
		next({ status: 400, msg: 'Patch request invalid' });
	updateArticleById(article_id, inc_votes)
		.then(article => {
			res.status(200).send({ article });
		})
		.catch(err => {
			next(err);
		});
};

exports.postArticle = (req, res, next) => {
	const { body } = req;
	insertArticle(body)
		.then(article => {
			res.status(201).send({ article });
		})
		.catch(err => {
			next(err);
		});
};

exports.deleteArticleById = (req, res, next) => {
	const { article_id } = req.params;
	destroyArticle(article_id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
};
