const router = require('express').Router();
const withAuth = require("../../util/auth");
const { getTasks,createTask, updateTask, deleteTask, updateStatus } = require('../../controllers/task-controller');

router.get('/:listId',withAuth, getTasks);
router.post('/:listId', withAuth, createTask);
router.put('/:listId/:id', withAuth, updateTask);
router.delete('/:listId/:id', withAuth, deleteTask);
router.put('/status/:listId/:id', withAuth, updateStatus);

module.exports = router;
