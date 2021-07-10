const mysql = require('mysql')
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sasako98',
  database : 'backend_2021'
});

module.exports = db