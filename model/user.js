const mongoose = require('mongoose');
const Course = require('./course');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    canvas_api_key: {
        type: String,
        required: true
    },
    courses: [{
        type: Number,
        ref: 'Course',
        default: [],
    }]
});

userSchema.methods.updateUserCourses = async function() {
    const url = "https://canvas.nus.edu.sg/api/v1/courses";

    const options = {
        method: "GET",
        headers: {
            "Authorization" : "Bearer " + this.canvas_api_key
        },
    };

    for (let pageNum = 1; ; pageNum++) {
        const urlPage = url + "?page=" + pageNum;

        const jsonObj = await fetch(new Request(urlPage, options))
        .then(res => {return res.json()})
        .catch(e => console.log(e)); 

        if (jsonObj.length === 0) {
            break;
        }
        
        for (let i = 0; i < jsonObj.length; i++) {
            const subJson = jsonObj[i];
            
            if (subJson.name == null) {
                continue;
            }

            folderPath = url + "/" + subJson.id + '/folders';
            
            const idx = this.courses.findIndex(e => e === subJson.id); 

            let course;
            if (idx === -1) {
                course = new Course({
                    _id: subJson.id,
                    course_name: subJson.name,
                });
                this.courses.push(course._id);
            } else {
                course = await Course.findById(this.courses[idx]).exec();
            }
            course.updateCourseFolders(folderPath, options)
                .catch(e => console.log('dup course:' + course.course_name));
        }
        await this.save();
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;