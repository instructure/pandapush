exports.up = function(knex, Promise) {
  return knex.schema.table("keys", table => {
    table.timestamp("last_used");
    table.integer("use_count");
  });
};

exports.down = function(knex, Promise) {};
