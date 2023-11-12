const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File = require('./file');
const options = require('../utils/constants').HTML_OPTIONS;

const folderSchema = new Schema({
    folder_name: {
        type: String,
    },
    files: [File.schema]
})

folderSchema.statics.update = async function update(filePath) {
    const jsonObj = await fetch(new Request(filePath, options))
        .then(res => {return res.json()})
        .catch(e => console.log(e));

    const files = [];
    for (let i = 0; i < jsonObj.length; i++) {
        const subJson = jsonObj[i];
        files.push(new File({
            file_name: subJson.display_name,
            url: subJson.url
        }));
    }
    console.log('files filled');
    return files;
}

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;