const mysql = require('mysql');
const chalk = require('chalk');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gpadb'
});

connection.connect(function (err) {
  if (err) {
    console.error(chalk.yellow('Connect Database ') + chalk.red('Error'));
    return;
  }

  console.log(chalk.yellow('Connect Database ') + chalk.cyan('Successfully'));
});

module.exports = connection