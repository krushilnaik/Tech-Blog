const router = require('express').Router();
const apiRoutes = require('./api');
const webRoutes = require('./web');

router.use('/api', apiRoutes);
router.use('/', webRoutes);

router.use((req, res) => {
	res.status(404).end();
});

module.exports = router;
