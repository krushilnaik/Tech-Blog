const router = require('express').Router();

const apiRoutes = require('./api');
const webRoutes = require('./web');
// const webRoutes = require('./web/home.routes.js');
// const dashboardRoutes = require('./web/dashboard.routes.js');

router.use('/api', apiRoutes);
router.use('/', webRoutes);
// router.use('/', webRoutes);
// router.use('/dashboard', dashboardRoutes);

module.exports = router;
