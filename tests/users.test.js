// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const should = chai.should();
// const {app, runServer, closeServer} = require('../server');
// const {TEST_DATABASE_URL} = require('../config/keys');
// const {User} = require('../users');
// const {JWT_SECRET} = require('../config/keys');
// const jwt = require('jsonwebtoken');


// chai.use(chaiHttp);

// const expect = chai.expect;


// describe('/api/employee/register', function() {
//     const username = 'exampleUser';
//     const password = 'examplePass';
//     const firstName = 'Example';
//     const lastName = 'User';
//     const usernameB = 'exampleUserB';
//     const passwordB = 'examplePassB';
//     const firstNameB = 'ExampleB';
//     const lastNameB = 'UserB';

//     before(function() {
//         return runServer(TEST_DATABASE_URL);
//     });

//     after(function() {
//         return closeServer();
//     });

//     beforeEach(function() {});

//     afterEach(function() {
//         return User.remove({});
//     });

//     describe('/api/employee/register', function() {
//         describe('POST', function() {
//             it('Should reject users with missing username', function() {
//                 return chai
//                     .request(app)
//                     .post('/api/employee/register')
//                     .send({
//                         password,
//                         firstName,
//                         lastName
//                     })
//                     .then(() =>
//                         expect.fail(null, null, 'Request should not succeed')
//                     )
//                     .catch(err => {
//                         if (err instanceof chai.AssertionError) {
//                             throw err;
//                         }

//                         const res = err.response;
//                         expect(res).to.have.status(422);
//                         expect(res.body.reason).to.equal('ValidationError');
//                         expect(res.body.message).to.equal('Missing field');
//                         expect(res.body.location).to.equal('username');
//                     });
//             });
//             it('Should reject users with missing password', function() {
//                 return chai
//                     .request(app)
//                     .post('/api/employee/register')
//                     .send({
//                         username,
//                         firstName,
//                         lastName
//                     })
//                     .then(() =>
//                         expect.fail(null, null, 'Request should not succeed')
//                     )
//                     .catch(err => {
//                         if (err instanceof chai.AssertionError) {
//                             throw err;
//                         }

//                         const res = err.response;
//                         expect(res).to.have.status(422);
//                         expect(res.body.reason).to.equal('ValidationError');
//                         expect(res.body.message).to.equal('Missing field');
//                         expect(res.body.location).to.equal('password');
//                     });
//             });
            
//         });
//     });
// });