
exports.up = function(knex, Promise) {
  return knex.schema.createTable('google', table => {
    table.increments();

    table.integer('user_id').references('user.id').unsigned().onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('google');
};
