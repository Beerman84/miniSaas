const { Pool } = require("pg");
const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "miniSaas",
    user: "YOURPASSWORD",
    password: "YOURPASSWORD"
});

module.exports = pool;