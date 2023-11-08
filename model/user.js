const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseSchema = require('./course').schema;

const userSchema = new Schema({
    canvas_api_key: {
        type: String,
        required: true
    },
    courses: [courseSchema]
});

const User = mongoose.model('User', userSchema);
module.exports = User;