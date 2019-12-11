exports.up = function(knex) {
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
	return knex.schema.dropTable('comments');
};
