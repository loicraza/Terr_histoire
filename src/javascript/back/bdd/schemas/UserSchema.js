const { Schema } = require("mongoose");

module.exports.UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});