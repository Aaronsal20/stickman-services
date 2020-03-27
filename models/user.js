const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:  { type: String, required: true, unique: true
    },
    nickName: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);