const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File = require('./file');

const folderSchema = new Schema({
    _id: Number,
    folder_name: {
        type: String,
    },
    files: [{
        type: Number,
        ref: 'File',
        default: [],
    }]
})

folderSchema.methods.updateFolderFiles = async function(filePath, options) {
    const jsonObj = await fetch(new Request(filePath, options))
        .then(res => {return res.json()})
        .catch(e => console.log(e));

    for (let i = 0; i < jsonObj.length; i++) {
        const subJson = jsonObj[i];
        const idx = this.files.findIndex(e => e === subJson.id);

        let file;
        if (idx === -1) {
            file = new File({
                _id: subJson.id,
                file_name: subJson.display_name,
                url: subJson.url
            });
            this.files.push(file._id);
        } else {
            file = await File.findById(this.files[idx]).exec();
            file.file_name = subJson.display_name;
            file.url = subJson.url;
        }
        file.save()
            .catch(e => console.log('dup file: ' + file.file_name));
    }
    await this.save();
    // console.log('[Folder] ' + this.folder_name + ' updated');
}

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;