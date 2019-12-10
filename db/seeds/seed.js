const {
	topicData,
	articleData,
	commentData,
	userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
	return knex.migrate
		.rollback()
		.then(() => {
			return knex.migrate.latest();
		})
		.then(() => {
			// console.log('seeding... 🥚');

			const topicsInsertions = knex('topics').insert(topicData);
			const usersInsertions = knex('users').insert(userData);

			return Promise.all([topicsInsertions, usersInsertions]);
		})
		.then(() => {
			// console.log('formatting articles to correct date object...');
			const formattedArticles = formatDates(articleData);
			// console.log('inserting formatted articles...');
			// console.log(formattedArticles);
			return knex('articles')
				.insert(formattedArticles)
				.returning('*');
		})
		.then(articleRows => {
			// console.log(articleRows);
			// console.log('making articleRef object...');
			const articleRef = makeRefObj(articleRows, 'title', 'article_id');
			// console.log('formatting comments...');
			const formattedComments = formatComments(commentData, articleRef);
			// console.log('inserting comments... 🐣');
			console.log('inserting data		.... 🐣');
			return knex('comments').insert(formattedComments);
		});
};
