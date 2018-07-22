const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gpadb'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting Database');
      return;
    }
   
    console.log('Connect Database Successfully');
  });

module.exports = connection