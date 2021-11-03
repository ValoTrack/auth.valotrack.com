const mysql = require('mysql2');
const { dbhost,dbport,dbname,dbuser,dbpass } = require('./config.json');

// create the connection to database
const connection = mysql.createConnection({
  host: dbhost,
  port: dbport,
  user: dbuser,
  password: dbpass,
  database: dbname
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;