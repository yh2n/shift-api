'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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

    // if username and password aren't trimmed we give an error.
    //  We need to reject such values explicitly and inform user.
    // We'll silently trim the other fields, because they aren't credentials used
    // to log in.
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
            // bcrypt truncates after 72 characters
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
    // Username and password come in pre-trimmed, otherwise we throw an error
    // before this
    firstName = firstName.trim();
    lastName = lastName.trim();
  	console.log("username", username);
  	console.log("password", password);
  	console.log("firstName", firstName);
  	console.log("lastName", lastName);
  	console.log("emailAddres", email);

    //console.log("Result = ", result);
    return Admin.find({ username }).count()
        .then(count => {
            console.log("check 1");
            if (count > 0) {
                console.log("error 5");

                // There is an existing Admin with the same username
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }
            // If there is no existing user, hash the password
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
            // Forward all errors to the client
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

module.exports = { router };

