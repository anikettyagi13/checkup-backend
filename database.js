const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
  user: 'anikettyagi13@hospitalappserver',
  password: process.env.password,
  database: 'postgres',
  host: 'hospitalappserver.postgres.database.azure.com',
  port: '5432',
  ssl: true,
})

module.exports = pool
