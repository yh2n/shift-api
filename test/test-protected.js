const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const {TEST_DATABASE_URL} = require('../config');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;


chai.use(chaiHttp);

describe('Protected endpoint', function() {
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';
    const emailAddress = "test@employee.com";

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {
        return User.hashPassword(password).then(password =>
            User.create({
                username,
                password,
                firstName,
                lastName,
                emailAddress
            })
        );
    });

    afterEach(function() {
        return User.remove({});
    });

    describe('/api/protected', function() {
        it('Should reject requests with no credentials', function() {
            return chai
                .request(app)
                .get('/api/protected')
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(401);
                });
        });
    });
});
