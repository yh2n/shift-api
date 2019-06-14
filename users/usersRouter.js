'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const { defaultSchedule } = require('../utils/default_schedule');
const data = require('../utils/mock_data')


const cors = require('cors');
const { User } = require('./models');


// <--- GET --->

// get all employees
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
                res.status(500).json({ message: 'Internal server error' });
            })
});

router.get('/mock_data', (req, res) => {
    return res.json(data)
})

// get individual availability
router.get('/:id/availability', (req, res) => {
    return User.findById(req.params.id)
            .then(User => res.json(User.availability))
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: 'Internal server error' });
            })
});

// get indiviual selected schedule or return default schedule from ../utils/default_schedule if not found
router.get('/:id/schedule/:week', (req, res) => {
    let { id, week } = req.params;
    console.log(week)
    return User.findOne({_id:id},
        { schedule: { $elemMatch: { week } } } 
        )
        .then(({schedule}) => {
            if(schedule.length == 0) {
                console.log("returning default schedule")
                //res.json will return `defaultSchedule` with `week` set to `req.params`
                defaultSchedule[0].week = week
                res.json(defaultSchedule)
            }
            else {
            res.json(schedule);
            // console.log(schedule)
            }
        })
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
                user.availability = req.body;
                user.save()
                .then(() => {
                    return res.json(user.availability);
                    }
                )
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            })
});

router.put('/:id/schedule/:week', jsonParser, (req, res) => {
    let { id, week } = req.params;
    let schedule = req.body;
    return User.updateOne({ _id: id, 'schedule.week': week }, 
        { $set: {'schedule.$': schedule } })
    // `upsert` option not valid with `$` position operator so we analyse the Writeconcern
    // and push new schedule if `week`not found
        .then(updateResult => {
            if(updateResult.n == 0) {
                User.update({_id: id},
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


router.put('/:id/info', jsonParser,(req, res) => {
    console.log(req.body)
    const { id } = req.params;
    const { employeeInfo, address } = req.body;
    const { firstName, lastName, phone_number, email_address, position } = employeeInfo
    
    return User.updateOne({_id: id},
        {$set: { firstName, lastName, position, phone_number, email_address, address }}
        ).
        then(user => res.json(user))
})



module.exports = { router };



