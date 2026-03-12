/**
 * Knex configuration for E2E tests
 * Connects to the same database as the web service
 * BUT in isolated docker env which is ephemeral and  cleaned up
 */

const config = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: process.env.DATABASE_PATH || "/usr/src/app/localdata/db.sqlite"
  }
};

// match docker-compose setup
if (process.env.DATABASE === "postgres") {
  config.client = "pg";
  config.connection = {
    host: process.env.DATABASE_ADDRESS,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  };
}

module.exports = config;
