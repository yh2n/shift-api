const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;


const UserSchema = mongoose.Schema({
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
    email_address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: String,
    position: {
        type: String,
        default: ''
    },
    availability: {
        Mo_breakfast: {
            type: Boolean,
            default: false
            },
        Mo_lunch: {
            type: Boolean,
            default: false
            },
        Mo_dinner: {
            type: Boolean,
            default: false
            },
        Tu_breakfast: {
            type: Boolean,
            default: false
            },
        Tu_lunch: {
            type: Boolean,
            default: false
            },
        Tu_dinner: {
            type: Boolean,
            default: false
            },
        We_breakfast: {
            type: Boolean,
            default: false
            },
        We_lunch: {
            type: Boolean,
            default: false
            },
        We_dinner: {
            type: Boolean,
            default: false
            },
        Th_breakfast: {
            type: Boolean,
            default: false
            },
        Th_lunch: {
            type: Boolean,
            default: false
            },
        Th_dinner: {
            type: Boolean,
            default: false
            },
        Fr_breakfast: {
            type: Boolean,
            default: false
            },
        Fr_lunch: {
            type: Boolean,
            default: false
            },
        Fr_dinner: {
            type: Boolean,
            default: false
            },
        Sa_breakfast: {
            type: Boolean,
            default: false
            },
        Sa_brunch: {
            type: Boolean,
            default: false
            },
        Sa_dinner: {
            type: Boolean,
            default: false
            },
        Su_breakfast: {
            type: Boolean,
            default: false
            },
        Su_brunch: {
            type: Boolean,
            default: false
            },
        Su_dinner: {
            type: Boolean,
            default: false
       }
    },
    phone_number: {
        type: String
    },
    schedule: [
        {
            week: {
                type: Number,
                default: 1
            },
            Mo_breakfast: {
                type: Boolean,
                default: false
                },
            Mo_br_need_cover: {
                type: Boolean,
                    default: false
                },
            Mo_lunch: {
                type: Boolean,
                default: false
                },
            Mo_lunch_need_cover: {
                type: Boolean,
                default: false
                },
            Mo_dinner: {
                type: Boolean,
                default: false,
                },
            Mo_dinner_need_cover: {
                type: Boolean,
                default: false
                },
            Mo_can_cover: {
                type: Boolean,
                default: false
            },
            Tu_breakfast: {
                type: Boolean,
                default: false
                },
            Tu_br_need_cover: {
                type: Boolean,
                    default: false
                },
            Tu_lunch: {
                type: Boolean,
                default: false
                },
            Tu_lunch_need_cover: {
                type: Boolean,
                default: false
                },
            Tu_dinner: {
                type: Boolean,
                default: false
                },
            Tu_dinner_need_cover: {
                type: Boolean,
                default: false
                },
            Tu_can_cover: {
                type: Boolean,
                default: false
            },
            We_breakfast: {
                type: Boolean,
                default: false
                },
            We_br_need_cover: {
                type: Boolean,
                default: false
            },
            We_lunch: {
                type: Boolean,
                default: false
            },
            We_lunch_need_cover: {
                type: Boolean,
                default: false
                },
            We_dinner: {
                type: Boolean,
                default: false
                },
            We_dinner_need_cover: {
                type: Boolean,
                default: false
            },
            We_can_cover: {
                type: Boolean,
                default: false
            },
            Th_breakfast: {
                type: Boolean,
                default: false
            },
            Th_br_need_cover: {
                type: Boolean,
                default: false
            },
            Th_lunch: {
                type: Boolean,
                default: false
            },
            Th_lunch_need_cover: {
                type: Boolean,
                default: false
            },
            Th_dinner: {
                type: Boolean,
                default: false
                },
            Th_dinner_need_cover: {
                type: Boolean,
                default: false
                },
            Th_can_cover: {
                type: Boolean,
                default: false
            },
            Fr_breakfast: {
                type: Boolean,
                default: false
                },
            Fr_br_need_cover: {
                type: Boolean,
                    default: false
                },
            Fr_lunch: {
                type: Boolean,
                default: false
                },
            Fr_lunch_need_cover: {
                type: Boolean,
                default: false
            },
            Fr_dinner: {
                type: Boolean,
                default: false
                },
            Fr_dinner_need_cover: {
                type: Boolean,
                default: false
                },
            Fr_can_cover: {
                type: Boolean,
                default: false
            },
            Sa_breakfast: {
                type: Boolean,
                default: false
                },
            Sa_br_need_cover: {
                type: Boolean,
                    default: false
                },
            Sa_brunch: {
                type: Boolean,
                default: false
                },
            Sa_brunch_need_cover: {
                type: Boolean,
                default: false
                },
            Sa_dinner: {
                type: Boolean,
                default: false
                },
            Sa_dinner_need_cover: {
                type: Boolean,
                default: false
                },
            Sa_can_cover: {
                type: Boolean,
                default: false
            },
            Su_breakfast: {
                type: Boolean,
                default: false
                },
            Su_br_need_cover: {
                type: Boolean,
                    default: false
                },
            Su_brunch: {
                type: Boolean,
                default: false
                },
            Su_brunch_need_cover: {
                type: Boolean,
                default: false
                },
            Su_dinner: {
                type: Boolean,
                default: false
            },
            Su_dinner_need_cover: {
                type: Boolean,
                default: false
            },
            Su_can_cover: {
                type: Boolean,
                default: false
            }
    }
],
        
    address: {
        address_1: {
            type: String,
            default:'',
        },
        address_2: {
            type: String,
            default:'',
        },
        city: {
            type: String,
            default:'',
        },
        state: {
            type: String,
            default:'',
        },
         zip: {
             type: String,
             default:''
         },
    },
});

UserSchema.methods.serialize = function() {
    return {
        id: this._id || '',
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        email_address: this.email_address || '',
        phone_number: this.phone_number || '',
        position: this.position || '',
        availability: this.availability || '',
        schedule: this.schedule|| '',
        address: this.address || '',
        date: this.date || ''
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);


module.exports = { User };