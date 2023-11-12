const mongoose = require('mongoose');
const Course = require('./course');
const Schema = mongoose.Schema;
const courseSchema = require('./course').schema;
const options = require('../utils/constants').HTML_OPTIONS;

const userSchema = new Schema({
    canvas_api_key: {
        type: String,
        required: true
    },
    courses: [courseSchema]
});

userSchema.statics.update = async function update() {
    const url = "https://canvas.nus.edu.sg/api/v1/courses";

    const jsonObj = await fetch(new Request(url, options))
        .then(res => {return res.json()})
        .catch(e => console.log(e)); 
        
    const courses = [];
    for (let i = 0; i < jsonObj.length; i++) {
        const subJson = jsonObj[i];
        folderPath = url + "/" + subJson.id + '/folders';
        courses.push(new Course({
            course_name: subJson.name,
            folders: await Course.update(folderPath)
        }));
    }
    console.log('courses filled');
    return courses;
}

const User = mongoose.model('User', userSchema);
module.exports = User;