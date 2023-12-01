const mongoose = require('mongoose');
const User = require('./model/user');
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

    let user = await User.findOne({canvas_api_key: process.env.CANVAS_API_KEY}).exec();
    if (user === null) {
        user = new User({
            canvas_api_key: process.env.CANVAS_API_KEY,
        })
    }
    await user.updateUserCourses();
}