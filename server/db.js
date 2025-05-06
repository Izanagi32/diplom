const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.TURSO_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error('TURSO_URL and TURSO_AUTH_TOKEN must be set in .env');
}

const client = createClient({ url, authToken });

module.exports = client; 