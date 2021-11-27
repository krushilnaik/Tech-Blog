const express = require('express');
const routes = require('./controllers');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');

// set up Express
const app = express();
const PORT = process.env.PORT || 3001;

// configure view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine({ helpers }));
app.set('view engine', 'handlebars');

// add middleware

const sess = {
	secret: 'supersecretpassword',
	cookie: {
		expires: 10 * 60 * 1000
	},
	resave: true,
	rolling: true,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize
	})
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// set up routing
app.use(routes);

// spin up server and sync database
sequelize.sync({ force: true }).then(() => {
	app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
