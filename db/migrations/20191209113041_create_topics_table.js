exports.up = function(knex) {
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

	// console.log('creating topics table      . 🌱');
	return knex.schema.createTable('topics', table => {
		table.string('slug').primary();
		table.string('description');
	});
};

exports.down = function(knex) {
	// console.log('dropping topics table      .... 💥');
	console.log('dropped all tables 	.... 💥');
	return knex.schema.dropTable('topics');
};
