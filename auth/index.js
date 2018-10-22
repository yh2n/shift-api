'use strict';
const { router } = require('./authRouter');
const { localStrategy, jwtStrategy } = require('./strategies');

module.exports = {router, localStrategy, jwtStrategy};
