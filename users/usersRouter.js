'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const cors = require('cors');
const { User } = require('./models');

// <--- GET --->

// get all contacts
router.get('/employee_list', (req, res) => {
    return User.find()
        .then(users => res.json(users.map(user => user.serialize())))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.get('/employee/:id', (req, res) => {
    return User.findById(req.params.id)
            .then(User => res.json(User.serialize()))
            .catch(err => {
                console.log(err);
                res.status(500).json({message: 'Internal server error'});
            })
});

// get individual availability
router.get('/:id/availability', (req, res) => {
    return User.findById(req.params.id)
            .then(User => res.json(User.availability))
            .catch(err => {
                console.log(err);
                res.status(500).json({message: 'Internal server error'});
            })
});

// get indiviual current schedule
router.get('/:id/schedule', (req, res) => {
    return User.findOne({_id:req.params.id},{schedule: {$elemMatch:{week:2}}})
        .then(schedule => res.json(schedule))
        .catch(err => {
        console.log(err);  
        res.status(500).json({message: 'Internal server error'});
    })
});

// get indiviual following schedule
router.get('/:id/next_schedule', (req, res) => {
    return User.findById(req.params.id)
    .then(User => res.json(User.next_schedule))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    })
});

// get indiviual address
router.get('/:id/info', (req, res) => {
    return User.findById(req.params.id)
    .then(User => res.json(User.address))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    })
});

// <--- POST --->

// --- registers new user ---
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

    //   If username and password aren't trimmed we give an error.
    // We need to reject such values explicitly and inform user.
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
    //  Username and password come in pre-trimmed, otherwise we throw an error
    // before this
    firstName = firstName.trim();
    lastName = lastName.trim();
  	
    return User.find({ username }).count()
        .then(count => {
            console.log("check 1");
            if (count > 0) {
                console.log("error 5");

                // There is an existing user with the same username
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }
            // If there is no existing user, hash the password
            return User.hashPassword(password);
        })
        .then(hash => {
            console.log("check 2");
            return User.create({
                username,
                password: hash,
                firstName,
                lastName,
                emailAddress: email
            });
        })
        .then(user => {
            console.log("check 3");
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            console.log("unexpected error!", err);
            // Forward all errors to the client
            res.status(err.code).json(err);
        })
});


// <--- PUT --->

router.put('/:id/availability', jsonParser,(req, res) => {
    console.log(req.body);
    return User.findById(req.params.id)
            .then(user => { 
                console.log(`updating user ${user.username}'s availability`);
                user.availability = req.body;
                user.save()
                .then(() => {
                    return res.json(user.availability);
                    }
                )
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            })
});

router.put('/:id/schedule', jsonParser,(req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    return User.findById(req.params.id)
            .then(user => { 
                console.log(`updating ${user.username}'s current schedule`);
                user.schedule = req.body;
                user.save()
                .then(() => {
                    return res.json(user.schedule);
                    }
                )
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            })
});

router.put('/:id/next_schedule', jsonParser,(req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    return User.findById(req.params.id)
            .then(user => { 
                console.log(`updating ${user.username}'s next week's schedule`);
                user.next_schedule = req.body;
                user.save()
                .then(() => {
                    return res.json(user.next_schedule);
                    }
                )
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            })
});

router.patch('/:id/info', jsonParser,(req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    return User.findById(req.params.id)
            .then(user => { 
                console.log(`updating ${user.username}'s info`);
                const {firstName,lastName, position, phone_number, email_address, address_1, address_2, city, zip, state} = req.body;
                //will only update submitted fields
                if (firstName) {
                    user.firstName = firstName
                }
                if (lastName) {
                    user.lastName = lastName
                }
                if (position) {
                    user.position = position
                }
                if (phone_number) {
                    user.phone_number = phone_number
                }
                if (email_address) {
                    user.email_address = email_address
                }
                if (phone_number) {
                    user.phone_number = phone_number
                }
                if (address_1) {
                    user.address.address_1 = address_1
                }
                if (address_2) {
                    user.address.address_2 = address_2
                }
                if (city) {
                    user.address.city = city
                }
                if (state) {
                    user.address.state = state
                }
                if (zip) {
                    user.address.zip = zip
                }
                //const {firstName,lastName, position, phone_number} = req.body;
                    // user.lastName = lastName;
                    // user.position = position;
                    // user.phone_number = phone_number;
                    return user.save()
            })
            .then((user) => {
                return res.json();
                }
            )
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            })
});


module.exports = { router };
