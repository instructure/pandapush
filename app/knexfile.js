const path = require('path');

let config = {
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_PATH || path.join(__dirname, '../localdata/db.sqlite')
  }
};

if (process.env.DATABASE === 'postgres') {
  config = {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_ADDRESS,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    }
  };
}

// Config is dynamic based on environment, so just pass
// whatever is set as both dev and prod so knex will use it.

module.exports = {
  development: config,
  production: config
};
