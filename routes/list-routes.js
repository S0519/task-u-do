const withAuth = require("../util/auth");
const {renderList} = require("../controllers/list-controller");
const router = require('express').Router();

router.get('/:id', withAuth, renderList);

module.exports = router;
