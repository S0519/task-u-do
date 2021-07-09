const withAuth = require("../util/auth");
const {renderDashboard} = require("../controllers/dashboard-controller");
const router = require('express').Router();

router.get('/',withAuth, renderDashboard);

module.exports = router;
