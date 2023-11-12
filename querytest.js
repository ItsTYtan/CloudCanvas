const mongoose = require('mongoose');
const User = require('./model/user');
const Course = require('./model/course');
const Folder = require('./model/folder');
const File = require('./model/file');
const { json } = require('express');
require('dotenv').config();

// test("https://canvas.nus.edu.sg/api/v1/courses", options);

async function test(url, options) {
    fetch(new Request(url, options))
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(e => console.log(e))
}

init().catch(e => console.log(e));

async function init() {
    await mongoose.connect(process.env.DB_URL);

    // getting courses for each user
    const courses = [];

    const user = new User({
        canvas_api_key: process.env.CANVAS_API_KEY,
        courses: await User.update()
    })

    console.log('all done!');
    user.save();
}