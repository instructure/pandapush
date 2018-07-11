exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("applications", table => {
      table.string("id").primary();
      table.string("name");
      table.string("created_by");
      table.timestamps();
    }),

    knex.schema.createTable("application_users", table => {
      table
        .string("application_id")
        .references("id")
        .inTable("applications");
      table.string("user_id");
    }),

    knex.schema.createTable("keys", table => {
      table.string("id").primary();
      table
        .string("application_id")
        .references("id")
        .inTable("applications");
      table.string("secret");
      table.string("created_by");
      table.timestamp("expires");
      table.string("purpose");
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {};
