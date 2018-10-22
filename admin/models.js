const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

AdminSchema.methods.serialize = function() {
    return {
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || ''
    };
};

AdminSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

AdminSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const Admin = mongoose.model('Admin', AdminSchema);


module.exports = { Admin };
