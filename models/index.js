const User = require('./user');
const List = require('./list');
const Task = require('./task');

User.hasMany(List, {
	foreignKey: 'user_id'
})

List.belongsTo(User, {
	foreignKey: 'user_id'
})

List.hasMany(Task, {
	foreignKey: 'list_id'
})

Task.belongsTo(List, {
	foreignKey: 'list_id'
})

module.exports = {
	User,
	List,
	Task
};
