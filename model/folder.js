const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileSchema = require('./file').schema;

const folderSchema = new Schema({
    folder_name: {
        type: String,
    },
    files: [fileSchema]
})

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;