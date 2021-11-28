const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get('/', (req, res) => {
	User.findAll({
		attributes: { exclude: ['[password'] }
	})
		.then(data => res.json(data))
		.catch(err => {
			res.status(500).json(err);
		});
});

router.get('/:id', (req, res) => {
	User.findOne({
		attributes: { exclude: ['password'] },
		where: {
			id: req.params.id
		},
		include: [
			{
				model: Post,
				attributes: Object.keys(Post.rawAttributes)
			},
			{
				model: Comment,
				attributes: ['id', 'comment_text', 'createdAt'],
				include: {
					model: Post,
					attributes: ['title']
				}
			},
			{
				model: Post,
				attributes: ['title']
			}
		]
	})
		.then(data => {
			if (!data) {
				res.status(404).json({ message: 'No user found with this id' });
				return;
			}
			res.json(data);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.post('/', (req, res) => {
	const { username, password } = req.body;

	User.create({ username, password })
		.then(data => {
			req.session.save(() => {
				req.session.user_id = data.id;
				req.session.username = data.username;
				req.session.loggedIn = true;

				res.json(data);
			});
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.post('/login', (req, res) => {
	const { username } = req.body;

	User.findOne({ where: { username } })
		.then(data => {
			if (!data) {
				res.status(400).json({ message: 'No user with that username!' });
				return;
			}
			const validPassword = data.checkPassword(req.body.password);

			if (!validPassword) {
				res.status(400).json({ message: 'Incorrect password!' });
				return;
			}

			req.session.save(() => {
				req.session.user_id = data.id;
				req.session.username = data.username;
				req.session.loggedIn = true;

				res.json({ user: data, message: 'You are now logged in!' });
			});
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.post('/logout', (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

router.put('/:id', (req, res) => {
	const { id } = req.params;

	User.update(req.body, { individualHooks: true, where: { id } })
		.then(data => {
			if (!data[0]) {
				res.status(404).json({ message: 'No user found with this id' });
				return;
			}
			res.json(data);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;

	User.destroy({ where: { id } })
		.then(data => {
			if (!data) {
				res.status(404).json({ message: 'No user found with this id' });
				return;
			}
			res.json(data);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

module.exports = router;
