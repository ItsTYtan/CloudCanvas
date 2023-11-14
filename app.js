const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/user');
const File = require('./model/file');
require('dotenv').config();

const app = express();

main();

async function main() {
    const dbUrl = mongoose.connect(process.env.DB_URL)
    .then((res) => app.listen(3000))
    .catch(e => console.log(e));

    const user = await User.findOne({canvas_api_key: process.env.CANVAS_API_KEY})
        .populate('courses')
        .exec();
    console.log(user);

    app.set('view engine', 'ejs');
    app.use(express.static('public'));

    app.get('/', (req, res) => {
        res.render('index', user);
    });

    app.get('/course/:id', (req, res) => {
        res.render('course', user.courses);
    })
}