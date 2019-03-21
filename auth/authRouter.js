'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config/keys');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};


router.use(bodyParser.json());

const localAuth = passport.authenticate('local', {session: false});
// User provides username and password to login
router.post('/login', localAuth, (req, res) => {
  try {
    console.log("auth successful");
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken});
  }
   catch (err) {
      console.log(err);
   }
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// User exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = { router };