const path = require('path');
const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');

const hbs = exphbs.create();

hbs.handlebars.registerHelper('ifvalue', function (conditional, options) {
	if (options.hash.value === conditional) {
		return options.fn(this)
	} else {
		return options.inverse(this);
	}
});

const session = require('express-session');

//Session.store saves the session on the server for the user, who is currently logged in//
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
	secret: "Secret",
	cookie: {},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize,
	}),
};

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session(sess));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.use(routes);

sequelize.sync();

// wait for user input, to perform the next operation//
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}!`);
});
