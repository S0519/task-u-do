const {TASK_STATUS} = require("../util/constants");
const {LIST_STATUS} = require("../util/constants");
const {getKeyByValue} = require("../util/utils");
const {List, Task} = require('../models');

exports.renderList = (req, res) => {
	if (!req.params.id){
		res.redirect('/dashboard');
		return;
	}
	//find the specific list, make sure the user has permission and display the tasks
	List.findOne({
		where: {
			user_id: req.session.user_id,
			id: req.params.id,
		},
		include: [
			{
				model: Task,
				foreignKey: 'list_id',
			}
		]
	})
		.then(foundList => {
			if (!foundList){
				res.redirect('/dashboard');
				return;
			}

			let cleanTasks = []
			const parsedTasks = foundList.tasks.map(x => x.get({plain: true}));
			if (parsedTasks && parsedTasks[0] && parsedTasks[0].id){
				cleanTasks = parsedTasks.map(x => {
					x.status_name = getKeyByValue(TASK_STATUS, x.status);
					return x;
				})
			}

			res.render('list', { tasks: cleanTasks, list_name: foundList.title, list_id: foundList.id});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
}

exports.getLists = (req, res) => {
	//get user list
	List.findAll({
			where: {
				user_id: req.session.user_id
			}
		})
		.then(foundLists => {
			const cleanLists = foundLists.map(x => x.get({ plain: true }));
			const updatedLists = cleanLists.map(x => {
				x.status_name = getKeyByValue(LIST_STATUS, x.status);
				return x;
			});
			res.status(200).send(updatedLists);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};

exports.createList = (req, res) => {
	//verify first and return nice messages
	const errors = [];
	if (!req.body.title) {
		errors.push('A title is required');
	}
	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	req.body.user_id = req.session.user_id;
	req.body.status = LIST_STATUS["Not Started"];

	List.create(req.body)
		.then(newList => {
			res.status(200).send(newList);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};

exports.updateList = (req, res) => {
	const errors = [];
	if (!req.params.id) {
		errors.push('A list id is required');
	}

	if (!req.body.title) {
		errors.push('A title is required');
	}
	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	List.findOne({
			where: {
				id: req.params.id,
				user_id: req.session.user_id
			}
		})
		.then(foundList => {
			foundList.update({
					title: req.body.title
				})
				.then(updatedList => {
					res.status(200).send(updatedList);
				})

		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};

exports.deleteList = (req, res) => {
	const errors = [];
	if (!req.params.id) {
		errors.push('A list id is required');
	}

	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	List.findOne({
			where: {
				id: req.params.id,
				user_id: req.session.user_id
			}
		})
		.then(foundList => {
			//we need to clean up all the tasks
			Task.destroy({where: {list_id: foundList.id}})
				.then(() => {
					foundList.destroy()
						.then(() => {
							res.status(200).send({message: ["list deleted successfully"]});
						})
				})

		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};
