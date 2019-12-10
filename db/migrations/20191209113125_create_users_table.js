exports.up = function(knex) {
	// console.log('creating users table       ..');
	return knex.schema.createTable('users', table => {
		table
			.string('username') // << table.string('name', [limit])
			.primary()
			.unique();
		table.string('avatar_url');
		table.string('name');
	});
};

exports.down = function(knex) {
	// console.log('dropping users table       ...');
	return knex.schema.dropTable('users');
};
