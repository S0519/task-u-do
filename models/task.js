const {Model, DataTypes} = require("sequelize");
const sequelize = require("../config/connection");

class Task extends Model {
}

Task.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		list_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "list",
				key: "id",
			},
		},
	},
	{
		hooks: {
			async beforeCreate(newTask) {
				newTask.list_id = parseInt(newTask.list_id);
				return newTask;
			},
		},
		sequelize,
		freezeTableName: true,
		underscored: true,
		modelName: "task",
	}
);

module.exports = Task;
