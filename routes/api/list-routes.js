const router = require('express').Router();
const withAuth = require("../../util/auth");
const { getLists,createList, updateList, deleteList } = require('../../controllers/list-controller');

router.get('/', withAuth, getLists);
router.post('/', withAuth, createList);
router.put('/:id', withAuth, updateList);
router.delete('/:id', withAuth, deleteList);

module.exports = router;
