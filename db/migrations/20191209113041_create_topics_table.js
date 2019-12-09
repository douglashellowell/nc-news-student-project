exports.up = function(knex) {
	console.log('creating topics table      . 🌱');
	return knex.schema.createTable('topics', table => {
		table.string('slug').primary();
		table.string('description');
	});
};

exports.down = function(knex) {
	console.log('dropping topics table      .... 💥');
	return knex.schema.dropTable('topics');
};
