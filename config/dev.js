exports.DATABASE_URL = process.env.DATABASE_URL || 
					   global.DATABASE_URL || 
					//   'mongodb://tenka:satya@ds113063.mlab.com:13063/staff-data';

					'mongodb://tenka:satya0517@ds239337-a0.mlab.com:39337,ds239337-a1.mlab.com:39337/shift_db_dev?replicaSet=rs-ds239337'
					exports.TEST_DATABASE_URL = (process.env.TEST_DATABASE_URL ||
						'mongodb://localhost/test-staff-data');
exports.PORT = process.env.PORT || 8080;

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

exports.JWT_SECRET = process.env.JWT_SECRET || 'WHITE_RABBIT';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

