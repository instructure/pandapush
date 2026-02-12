exports.up = function(knex) {
  return knex.schema.table("keys", table => {
    table.timestamp("last_used");
    table.integer("use_count");
  });
};

exports.down = function(knex) {};
