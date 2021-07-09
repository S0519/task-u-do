const router = require('express').Router();
const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboard-routes');
const homeRoutes = require('./home-routes');
const listRoutes = require('./list-routes');

router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/list', listRoutes);
router.use('/', homeRoutes);

router.use((req, res) => {
	res.status(404).end();
});


module.exports = router;
