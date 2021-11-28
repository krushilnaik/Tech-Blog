const { User } = require('../models');

const userData = [
	{
		username: 'krushilnaik',
		password: '$2b$10$F0RPv5g4PAdDDCB5V1yHy.wlur05fXUF6TBgk7texUaZkRu0hiNS.'
	},
	{
		username: 'someone_else',
		password: '$2b$10$F0RPv5g4PAdDDCB5V1yHy.wlur05fXUF6TBgk7texUaZkRu0hiNS.'
	}
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
