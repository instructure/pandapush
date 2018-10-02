exports.up = function(knex, Promise) {
  return knex.schema.alterTable("keys", table => {
    if (knex.schema.client.config.client !== "sqlite3") {
      table.string("secret", 1024).alter();
    }
  });
};

exports.down = function(knex, Promise) {};
