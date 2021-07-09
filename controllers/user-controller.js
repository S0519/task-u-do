const User = require("../models/user");

exports.createUser = (req, res) => {
	const errors = [];
	if (!req.body.username) {
		errors.push('A username is required');
	}

	if (!req.body.email) {
		errors.push('An email address is required');
	}

	if (!req.body.password) {
		errors.push('A password is required');
	}

	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}
	User.create(req.body)
		.then(newUser => {
			req.session.save(() => {
				req.session.user_id = newUser.id;
				req.session.username = newUser.username;
				req.session.loggedIn = true;

				newUser.password = '';
				res.status(200).send({
					user: newUser,
					message: ['You are now logged in!']
				});
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
};

exports.login = (req, res) => {
	const errors = [];
	if (!req.body.email) {
		errors.push('An email address is required');
	}

	if (!req.body.password) {
		errors.push('A password is required');
	}

	if (errors.length > 0) {
		res.status(400).send({errors: errors});
		return;
	}

	User.findOne({
			where: {
				email: req.body.email
			}
		})
		.then(foundUser => {
			if (!foundUser) {
				res.status(400).send({
					errors: ['Incorrect password!']
				});
				return;
			}

			const validPassword = foundUser.checkPassword(req.body.password);

			if (!validPassword) {
				res.status(400).send({
					errors: ['Incorrect password!']
				});
				return;
			}

			req.session.save(() => {
				req.session.user_id = foundUser.id;
				req.session.username = foundUser.username;
				req.session.loggedIn = true;

				foundUser.password = '';

				res.send({
					user: foundUser,
					message: ['You are now logged in!']
				});
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({errors: [err.message]});
		});
}
