exports.renderHome = (req, res) => {
	//if a person is logged in take them to the dashboard
	if (req.session.loggedIn) {
		res.redirect('/dashboard');
		return;
	}
	res.render('homepage');
};

exports.renderLogin = (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/dashboard');
		return;
	}

	res.render('login');
}

exports.renderSignup = (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/dashboard');
		return;
	}

	res.render('signup');
}

exports.handleLogout = (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy();
	}
	res.redirect('/');
}

exports.handleDefault = (req, res) => {
	res.redirect('/');
}

