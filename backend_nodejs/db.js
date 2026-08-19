const { Pool } = require("pg");
const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "miniSaas",
    user: "YOUR_USERNAME",
    password: "YOUR_PASSWORD"
});

module.exports = pool;
