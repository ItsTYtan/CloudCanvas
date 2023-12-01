const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/user');
const Course = require('./model/course');
require('dotenv').config();

const app = express();

main();

async function main() {
    await mongoose.connect(process.env.DB_URL)
    .then((res) => app.listen(3000))
    .catch(e => console.log(e));

    const user = await User.findOne({canvas_api_key: process.env.CANVAS_API_KEY})
        .populate('courses');

    app.set('view engine', 'ejs');
    app.use(express.static('public'));

    app.get('/', (req, res) => {
        res.render('index', user);
    });

    app.get('/course/:id', (req, res) => {
        Course.findById(req.params.id)
        .populate('folders')
        .then(course => {
            console.log(course);
            res.render('course', course);
        });
    })
}