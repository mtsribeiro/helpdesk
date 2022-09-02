const mysql = require('promise-mysql')

const connection = mysql.createConnection({
    host: "144.22.225.253",
    user: "aplicacao",
    port: "3306",
    password: "conline@2510A",
    database: "ProjetoConLine",
    charset: "utf8mb4"
})

function getConnection() {
    return connection;
}

module.exports = { getConnection}