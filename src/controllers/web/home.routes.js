const { Post, User, Comment } = require('../../models');
const router = require('express').Router();

router.get('/login', (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/');
		return;
	}
	res.render('login');
});

router.get('/signup', (req, res) => {
	res.render('signup');
});

router.get('/post/:id', (req, res) => {
	const { id } = req.params;
	const { loggedIn } = req.session;

	Post.findOne({
		where: { id },
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
			if (!data) {
				res.status(404).json({ message: 'No post found with this id' });
				return;
			}

			const post = data.get({ plain: true });

			console.log(post);
			res.render('single-post', { post, id, loggedIn });
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.get('/', (req, res) => {
	const { loggedIn } = req.session;

	Post.findAll({
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
			res.render('index', { posts, loggedIn });
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

module.exports = router;
