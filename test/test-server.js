const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);


describe('employees page', () => {
	before(()=> runServer(TEST_DATABASE_URL));

	after(()=> closeServer());

	it('should list all employees on GET', () => {
		return chai.request(app)
				.get('/api/admin/employee_list')
				.then((res) => {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					//res.body.length.should.be.at.least(1);
					//const expectedKeys = ['id', 'username', 'firstName', 'lastName', 'email_address', 'position']
			});
	});
});



