const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const folderSchema = require('./folder').schema;

const courseSchema = new Schema({
    course_name: {
        type: String,
    },
    folders: [folderSchema]
})

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;