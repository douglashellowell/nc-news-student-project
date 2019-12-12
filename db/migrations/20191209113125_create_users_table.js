exports.up = function(knex) {
	return knex.schema.createTable('users', table => {
		table
			.string('username') // << table.string('name', [limit])
			.primary()
			.unique();
		table.string('avatar_url').notNullable();
		table.string('name').notNullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('users');
};
