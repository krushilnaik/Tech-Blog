const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, (req, res) => {
	Post.findAll({
		where: {
			user_id: req.session.user_id
		},
		attributes: Object.keys(Post.rawAttributes),
		include: [
			{
				model: Comment,
				attributes: Object.keys(Comment.rawAttributes),
				include: {
					model: User,
					attributes: ['username']
				}
			},
			{
				model: User,
				attributes: ['username']
			}
		]
	})
		.then(data => {
			const posts = data.map(post => post.get({ plain: true }));
			res.render('dashboard', {
				posts,
				loggedIn: true,
				title: 'Your Dashboard'
			});
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.get('/edit/:id', withAuth, (req, res) => {
	const { id } = req.params;

	Post.findOne({
		where: { id },
		attributes: Object.keys(Post.rawAttributes),
		include: [
			{
				model: User,
				attributes: ['username']
			},
			{
				model: Comment,
				attributes: Object.keys(Comment.rawAttributes),
				include: {
					model: User,
					attributes: ['username']
				}
			}
		]
	})
		.then(data => {
			if (!data) {
				res.status(404).json({ message: 'No post found with this id' });
				return;
			}
			const post = data.get({ plain: true });
			res.render('edit-post', { post, loggedIn: true });
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.get('/new', (req, res) => {
	res.render('new-post');
});

module.exports = router;
