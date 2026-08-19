const { Pool } = require("pg");
const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "miniSaas",
    user: "postgres",
    password: "YOURPASSWORD"
});

module.exports = pool;