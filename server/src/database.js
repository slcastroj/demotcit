const pgPromise = require('pg-promise');

const environment = process.env.NODE_ENV || 'prod';
const database = environment === 'prod' ? 'tcit' : 'tcit-test';
const connectionString = `postgres://postgres:slcastroj@localhost:5432/${database}`;
const db = pgPromise()(connectionString);
exports.db = db;