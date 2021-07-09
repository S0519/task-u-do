const {TASK_STATUS} = require("../util/constants");
const {getKeyByValue} = require("../util/utils");
const {List, Task} = require('../models');


exports.getTasks = (req, res) => {
	const errors = [];
	if (!req.params.listId) {
		errors.push('A list id is required');
	}

	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	Task.findAll({
			where: {
				list_id: req.params.listId,
				'$list.user_id$': req.session.user_id
			},
			include: [
				{
					model: List,
					foreignKey: 'list_id',
					attributes: ['id'],
					required: true
				}
			]
		})
		.then(foundTasks => {
			const cleanTasks = foundTasks.map(x => x.get({ plain: true }));
			const updatedTasks = cleanTasks.map(x => {
				x.status_name = getKeyByValue(TASK_STATUS, x.status);
				return x;
			});
			res.status(200).send(updatedTasks);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};

exports.createTask = (req, res) => {
	const errors = [];
	if (!req.params.listId) {
		errors.push('A list id is required');
	}

	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	//make sure the user has permission to the list
	List.findOne({
			where: {
				id: req.params.listId,
				user_id: req.session.user_id
			}
		})
		.then(foundList => {
			if (!foundList) {
				res.status(400).send({errors: ["You do not own this list"]});
				return
			}
			//create the task
			req.body.list_id = req.params.listId;
			req.body.status = TASK_STATUS["To Do"];
			Task.create(req.body)
				.then(newTask => {
					res.status(200).send(newTask);
				})
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};

exports.updateTask = (req, res) => {
	const errors = [];
	if (!req.params.listId) {
		errors.push('A list id is required');
	}

	if (!req.params.id) {
		errors.push('A task id is required');
	}

	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	//make sure the user has permission to the list
	List.findOne({
			where: {
				id: req.params.listId,
				user_id: req.session.user_id
			}
		})
		.then(foundList => {
			if (!foundList) {
				res.status(400).send({errors: ["You do not own this list"]});
				return
			}
			//update the task
			Task.findByPk(req.params.id)
				.then(foundTask => {
					foundTask.update({
							title: req.body.title
						})
						.then(updatedTask => {
							res.status(200).send(updatedTask);
						})
				})
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};

exports.deleteTask = (req, res) => {
	const errors = [];
	if (!req.params.listId) {
		errors.push('A list id is required');
	}

	if (!req.params.id) {
		errors.push('A task id is required');
	}

	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	//make sure the user has permission to the list
	List.findOne({
			where: {
				id: req.params.listId,
				user_id: req.session.user_id
			}
		})
		.then(foundList => {
			if (!foundList) {
				res.status(400).send({errors: ["You do not own this list"]});
				return
			}
			//destroy the task
			Task.findByPk(req.params.id)
				.then(foundTask => {
					foundTask.destroy()
						.then(() => {
							res.status(200).send({message: ["task deleted successfully"]});
						})
				})
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};

exports.updateStatus = (req, res) => {
	const errors = [];
	if (!req.params.listId) {
		errors.push('A list id is required');
	}

	if (!req.params.id) {
		errors.push('A task id is required');
	}

	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	//make sure the user has permission to the list
	List.findOne({
			where: {
				id: req.params.listId,
				user_id: req.session.user_id
			}
		})
		.then(foundList => {
			if (!foundList) {
				res.status(400).send({errors: ["You do not own this list"]});
				return
			}
			//update the task status
			Task.findByPk(req.params.id)
				.then(foundTask => {
					foundTask.update({
							status: req.body.status
						})
						.then((updatedTask) => {
							res.status(200).send(updatedTask);
						})
				})
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
}
