exports.up = function(knex) {
	console.log('created all tables 	.... 🎄');
	// console.log('creating comments table    .... 🎄');
	return knex.schema.createTable('comments', table => {
		table.increments('comment_id').primary();
		table.string('author').references('users.username');
		table.integer('article_id').references('articles.article_id');
		table.integer('votes').defaultTo(0);
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.text('body'); // << string Vs. text ?
	});
};

exports.down = function(knex) {
	// console.log(
	// 	'\n',
	// 	'\x1b[7m',
	// 	`NODE_ENV = ${
	// 		process.env.NODE_ENV === 'test'
	// 			? 'test, using test DB'
	// 			: 'undefined, using development DB'
	// 	}`,
	// 	'\x1b[0m',
	// 	'\n\n'
	// );

	// console.log('dropping comments table    . 💣');
	return knex.schema.dropTable('comments');
};
