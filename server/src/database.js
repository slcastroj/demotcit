const pgPromise = require('pg-promise');

const pgPort = process.env.POSTGRE_PORT || 5432;
const pgHost = process.env.POSTGRE_HOST || 'localhost';
const pgDatabase = process.env.POSTGRE_DATABASE;
const pgDatabaseTesting = process.env.POSTGRE_DATABASE_TESTING;
const pgUser = process.env.POSTGRE_USER || 'postgres';
const pgPass = process.env.POSTGRE_PASS;

const environment = process.env.NODE_ENV || 'prod';
const database = environment === 'prod' ? pgDatabase : pgDatabaseTesting;
const connectionString = `postgres://${pgUser}:${pgPass}@${pgHost}:${pgPort}/${database}`;
const db = pgPromise()(connectionString);
exports.db = db;