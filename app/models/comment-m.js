const connection = require('../../db/connection');
const { isLegalNumber } = require('../../db/utils/utils');

const updateComment = (comment_id, inc_votes = 0, invalid) => {
	if (Object.keys(invalid).length) {
		return Promise.reject({ status: 400, msg: 'Patch request invalid' });
	}
	if (isLegalNumber(inc_votes)) {
		return connection
			.increment('votes', inc_votes)
			.from('comments')
			.where('comment_id', comment_id)
			.returning('*')
			.then(([comment]) => {
				if (comment) return { comment };
				else {
					return Promise.reject({ status: 404, msg: 'Comment not found' });
				}
			});
	} else {
		return Promise.reject({ status: 400, msg: 'Patch request invalid' });
	}
};

const destroyComment = comment_id => {
	return connection
		.from('comments')
		.where('comment_id', comment_id)
		.del()
		.then(response => {
			if (!response)
				return Promise.reject({ status: 404, msg: 'Comment not found' });
		});
};

module.exports = { updateComment, destroyComment };
