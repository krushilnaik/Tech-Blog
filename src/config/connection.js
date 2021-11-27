const { Sequelize } = require('sequelize');

require('dotenv').config();

let sequelize = process.env.JAWSDB_URL
	? new Sequelize(process.env.JAWSDB_URL)
	: new Sequelize({
			host: 'localhost',
			dialect: 'mysql',
			port: 3306,
			database: process.env.DB_NAME,
			username: process.env.DB_USER,
			password: process.env.DB_PW
	  });

module.exports = sequelize;
