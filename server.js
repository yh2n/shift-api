'use strict';
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const passport =require('passport');
const cors = require('cors');
const app = express();
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config/keys');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: adminRouter } = require('./admin');

// app.use(bodyParser.json({type: 'application/*+json'}));
// app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('common'));

//app.use(require("body-parser").json());


//CORS
app.use(
	cors({
		origin: CLIENT_ORIGIN,
		optionsSuccessStatus: 200,
	})
);

app.options('api/employee/:id/availability', cors());
app.put('api/employee/:id/availability', cors(), function(req, res, next) {
	res.json()
});
// app.use(function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

// 	//intercepts OPTIONS method
// 	if ('OPTIONS' === req.method) {
// 		//respond with 200
// 		res.sendStatus(200);
// 	}
// 	else {
// 	//move on
// 		next();
// 	}
// });

// app.options("/*", function(req, res, next){
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//   res.send(200);
// });

passport.use(jwtStrategy);
passport.use(localStrategy);

app.use('/api/admin/', adminRouter);
app.use('/api/employee/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });


app.get('/api/protected', jwtAuth, (req, res) => {
	return res.json({
		data: 'pw'
	});
});


mongoose.set('useCreateIndex',true);
let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
	return new Promise((resolve, reject) => {
		 mongoose.connect(databaseUrl, {useNewUrlParser: true}, err => {
			if(err) {
				return reject(err);
			}

			server = app.listen(port, () => {
				console.log(`Server is up on port ${port} connecting to database ${databaseUrl}` );
				resolve();
			}).on('error', err => {
				mongoose.disconnect();
				reject(err)
			});
		});
	});
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if(require.main === module) {
	runServer().catch(err => console.error(err))
};


module.exports = {app, runServer, closeServer};


