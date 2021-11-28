const seedUsers = require('./user.seed');
const seedPosts = require('./post.seed');
const seedComments = require('./comment.seed');

const sequelize = require('../config/connection');

const seedAll = async () => {
	await sequelize.sync({ force: true });
	await seedUsers();
	await seedPosts();
	await seedComments();

	process.exit(0);
};

seedAll();
