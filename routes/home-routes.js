const router = require('express').Router();
const { renderHome, renderLogin, renderSignup, handleLogout, handleDefault } = require('../controllers/home-controller');
router.get('/', renderHome);
router.get('/login', renderLogin);
router.get('/signup', renderSignup);
router.get('/logout', handleLogout);
router.get('*', handleDefault)
module.exports = router;
