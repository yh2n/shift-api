const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config/keys');
const {User} = require('../users');
const {JWT_SECRET} = require('../config/keys');

chai.use(chaiHttp);

const expect = chai.expect;

// describe('Auth endpoints', function() {
//     const username = 'exampleUser';
//     const password = 'examplePass';
//     const firstName = 'Example';
//     const lastName = 'User';
//     const emailAddress = "employee@test.com";

//     before(function() {
//         return runServer(TEST_DATABASE_URL);
//     });

//     after(function() {
//         return closeServer();
//     });

//     beforeEach(function() {
//         return User.hashPassword(password).then(password =>
//             User.create({
//                 username,
//                 password,
//                 firstName,
//                 lastName,
//                 emailAddress
//             })
//         );
//     });

//     afterEach(function() {
//         return User.remove({});
//     });

//     describe('/api/auth/login', function() {
//         it('Should reject requests with no credentials', function() {
//             return chai
//                 .request(app)
//                 .post('/api/auth/login')
//                 .then(() =>
//                     expect.fail(null, null, 'Request should not succeed')
//                 )
//                 .catch(err => {
//                     if (err instanceof chai.AssertionError) {
//                         throw err;
//                     }

//                     const res = err.response;
//                     expect(res).to.have.status(401);
//                 });
//         });
//     });
// });