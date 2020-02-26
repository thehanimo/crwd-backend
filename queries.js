const Pool = require("pg").Pool;
const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "crwd",
  password: "password",
  port: 5432
});

module.exports = pool;
