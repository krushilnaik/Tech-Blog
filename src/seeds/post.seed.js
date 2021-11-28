const { Post } = require('../models');

const postData = [
	{
		title: 'This is a post',
		content: 'Does whatever a post does',
		user_id: 1
	},
	{
		title: 'This is another post',
		content: 'Very description',
		user_id: 2
	},
	{
		title: 'This would be so much easier with NextJS',
		content: 'And Prisma ORM... and not-Heroku',
		user_id: 1
	}
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;
