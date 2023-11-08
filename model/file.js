const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    file_name: {
        type: String,
    },
    url: {
        type: String,
        required: true
    },
});

const File = mongoose.model('File', fileSchema);
module.exports = File;