const { updateComment, destroyComment } = require('../models/comment-m.js');

exports.patchCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes, ...invalid } = req.body;
	updateComment(comment_id, inc_votes, invalid)
		.then(comment => {
			res.status(200).send(comment);
		})
		.catch(err => {
			next(err);
		});
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	destroyComment(comment_id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
};
