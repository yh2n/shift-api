'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Pusher = require('pusher');

const pusher = new Pusher({
	appId      : '805240',
	key        : 'dd4cfaae3504bbdaa2b2',
	secret     : '6721c324e672025e50e3',
	cluster    : 'us2',
	useTLS  : true,
  });

const cors = require('cors');

const { Admin } = require('./models');
const { User } = require('../users/models');

router.get('/', (req, res) => {
	res.json(Admin.get());
});

// <--- GET --->

// employee database
router.get('/employee_list', (req, res) => {
    return User.find()
        .then(users => res.json(users.map(user => user.serialize())))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// employee by id
router.get('/employee/:id', (req, res) => {
    return User.findById(req.params.id)
            .then(User => res.json(User.serialize()))
            .catch(err => {
                console.log(err);
                res.status(500).json({message: 'Internal server error'});
            })
});

// availability by employee
router.get('/employee/:id/availability', (req, res) => {
    return User.findById(req.params.id)
            .then(User => res.json(User.availability))
            .catch(err => {
                console.log(err);
                res.status(500).json({message: 'Internal server error'});
            })
});


// registers new admin
router.options('/', cors());
router.post('/register', jsonParser, (req, res) => {
    const requiredFields = ['username', 'firstName', 'lastName', 'password', 'email']
    const missingField = requiredFields.find(field => !(field in req.body));
    console.log(req.body);

    if (missingField) {
        console.log('error 1');
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }
    console.log("break 1");

    const stringFields = ['username', 'password', 'firstName', 'lastName', 'email'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        console.log("error 2");
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    console.log("break 2");

    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        console.log("error 3");
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }
    console.log("break 3");

    const sizedFields = {
        username: {
            min: 3
        },
        password: {
            min: 8,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(
        field =>
        'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field =>
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        console.log("error 4");

        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField ?
                `Must be at least ${sizedFields[tooSmallField]
			.min} characters long` : `Must be at most ${sizedFields[tooLargeField]
			.max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let { username, password, firstName = '', lastName = '', email } = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    return Admin.find({ username }).count()
        .then(count => {
            console.log("check 1");
            if (count > 0) {
                console.log("error 5");

                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }
            return Admin.hashPassword(password);
        })
        .then(hash => {
            console.log("check 2");
            return Admin.create({
                username,
                password: hash,
                firstName,
                lastName,
                emailAddress: email
            });
        })
        .then(admin => {
            console.log("check 3");
            return res.status(201).json(admin.serialize());
        })
        .catch(err => {
            console.log("unexpected error!", err);
            res.status(err.code).json(err);
        })
});


router.get('/', (req, res) => {
    return Admin.find()
        .then(admins => res.json(admins.map(admin => admin.serialize())))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});



const { Employee } = require('./models');

//adds new employee to db
router.post('/new_hire', jsonParser, (req, res) => {
	const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'emailAddress'];
	for(let i = 0; i <= requiredFields.length; i++ ) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing field '${field}' in request body`;
			console.log(message);
			console.log(req.body);
			return res.status(400).send(message);
		}
	} 
	const addNewployee = Employee.create({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		emailAdress: req.body.emailAddress,
		phoneNumber: req.body.phoneNumber
	});
	res.status(201).json(newAdmin);
	console.log("admin added to database");
});


router.put('/:id/schedule/:week', jsonParser, (req, res) => {
    let { id, week } = req.params;
    let schedule = req.body;
            
    pusher.trigger('new_schedule', 'schedule_update', {
        schedule
    })
    return User.updateOne({ _id: id, 'schedule.week': week }, 
        { $set: {'schedule.$': schedule } })
    // `upsert` option not valid with `$` position operator so we analyse the Writeconcern
    // and push new schedule if `week`not found
        .then(updateResult => {
            if(updateResult.n === 0) {
                User.updateOne({ _id: id },
                    { $push: { 
                        schedule: {
                            $each: [ schedule ],
                            $sort: { week: 1 }
                        }
                    }}
                )
                .catch(err => console.log(`------------- ${ err }`))
            }
            return res.json(schedule)   
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        })
})

module.exports = { router };

