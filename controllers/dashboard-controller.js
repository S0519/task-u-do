const {TASK_STATUS} = require("../util/constants");
const {List} = require("../models");
const {LIST_STATUS} = require("../util/constants");
const {getKeyByValue} = require("../util/utils");
const {Sequelize} = require("sequelize");


exports.renderDashboard = (req, res) => {
	List.findAll({
			where: {
				user_id: req.session.user_id
			},
			attributes: {
				include: [
					[Sequelize.literal(`(SELECT COUNT(\`task\`.\`id\`) FROM \`task\` WHERE \`task\`.\`list_id\` = \`list\`.\`id\`) ` ), 'total'],
					[Sequelize.literal(`(SELECT COUNT(\`task\`.\`id\`) FROM \`task\` WHERE \`task\`.\`list_id\` = \`list\`.\`id\` AND \`task\`.\`status\` = ${TASK_STATUS.Completed}) ` ), 'completed'],
				],
			}
		})
		.then(foundLists => {
			let updatedLists = [];
			const cleanLists = foundLists.map(x => x.get({plain: true}));
			//check first value
			if (cleanLists && cleanLists[0] && cleanLists[0].id) {
				updatedLists = cleanLists.map(x => {
					x.status_name = getKeyByValue(LIST_STATUS, x.status);
					x.list_status = '(Not Started)';
					x.list_color = 'secondary';
					if (x.total > 0 && x.total > x.completed && x.completed > 0){
						x.list_status = '(In Progress)';
						x.list_color = 'info';
					}
					if (x.total > 0 && x.total === x.completed){
						x.list_status = '(Completed)';
						x.list_color = 'success';
					}

					return x;
				});
			}
			res.render('dashboard', { lists: updatedLists});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};
