const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/:id', (req, res) => {
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
			res.json(data);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.get('/', (req, res) => {
	console.log('======================');
	Post.findAll({
		attributes: Object.keys(Post.rawAttributes),
		order: [['createdAt', 'DESC']],
		include: [
			{
				model: User,
				attributes: ['username']
			},
			{
				model: Comment,
				attributes: Object.keys(Post.rawAttributes),
				include: {
					model: User,
					attributes: ['username']
				}
			}
		]
	})
		.then(data => res.json(data.reverse()))
		.catch(err => {
			res.status(500).json(err);
		});
});

router.post('/', withAuth, (req, res) => {
	const { title, content } = req.body;
	const { user_id } = req.session;

	Post.create({ title, content, user_id })
		.then(data => res.json(data))
		.catch(err => {
			res.status(500).json(err);
		});
});

router.put('/:id', withAuth, (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body;

	Post.update({ title, content }, { where: { id } })
		.then(data => {
			if (!data) {
				res.status(404).json({ message: 'No post found with this id' });
				return;
			}
			res.json(data);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.delete('/:id', withAuth, (req, res) => {
	const { id } = req.params;

	Post.destroy({ where: { id } })
		.then(data => {
			if (!data) {
				res.status(404).json({ message: 'No post found with this id' });
				return;
			}
			res.json(data);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

module.exports = router;
