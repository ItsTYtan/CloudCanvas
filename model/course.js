const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Folder = require('./folder');
const options = require('../utils/constants').HTML_OPTIONS;

const courseSchema = new Schema({
    course_name: {
        type: String,
    },
    folders: [Folder.schema]
})

courseSchema.statics.update = async function update(folderPath) {
    const jsonObj = await fetch(new Request(folderPath, options))
        .then(res => {return res.json()})
        .catch(e => console.log(e));

    const folders = [];
    for (let i = 0; i < jsonObj.length; i++) {
        const subJson = jsonObj[i];
        filePath = subJson.files_url;
        folders.push(new Folder({
            folder_name: subJson.name,
            files: await Folder.update(filePath)
        }));
    }
    console.log('folders filled');
    return folders;
}

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;