const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Folder = require('./folder');

const courseSchema = new Schema({
    _id: Number,
    course_name: {
        type: String,
    },
    folders: [{
        type: Number,
        ref: 'Folder',
        default: [],
    }]
})

courseSchema.methods.updateCourseFolders = async function(folderPath, options) {
    const jsonObj = await fetch(new Request(folderPath, options))
        .then(res => {return res.json()})
        .catch(e => console.log(e));

    for (let i = 0; i < jsonObj.length; i++) {
        const subJson = jsonObj[i];
        filePath = subJson.files_url;

        const idx = this.folders.findIndex(e => e == subJson.id); 

        let folder;
        if (idx === -1) {
            folder = new Folder({
                _id: subJson.id,
                folder_name: subJson.name,
            });
            this.folders.push(folder._id);
        } else {
            folder = await Folder.findById(this.folders[idx]).exec();
        }
        folder.updateFolderFiles(filePath, options)
            .catch(e => console.log('dup folder: ' + folder.folder_name));
    }
    await this.save();
    // console.log('[Course] ' + this.course_name + ' updated');
}

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;