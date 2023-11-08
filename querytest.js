const mongoose = require('mongoose');
const User = require('./model/user');
const Course = require('./model/course');
const Folder = require('./model/folder');
const File = require('./model/file');
const { json } = require('express');
require('dotenv').config();

const options = {
    method: "GET",
    headers: {
        "Authorization" : "Bearer " + process.env.CANVAS_API_KEY
    },
}

// test("https://canvas.nus.edu.sg/api/v1/folders/465682/files", options);

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
        courses: await fillCourses()
    })

    console.log('all done!');
    user.save();
}

async function fillCourses() {
    const url = "https://canvas.nus.edu.sg/api/v1/courses";

    const jsonObj = await fetch(new Request(url, options))
        .then(res => {return res.json()});

    const courses = [];
    for (let i = 0; i < jsonObj.length; i++) {
        const subJson = jsonObj[i];
        folderPath = url + "/" + subJson.id + '/folders';
        courses.push(new Course({
            course_name: subJson.name,
            folders: await fillFolders(folderPath)
        }));
    }
    console.log('courses filled');
    return courses;
}

async function fillFolders(folderPath) {
    const jsonObj = await fetch(new Request(folderPath, options))
        .then(res => {return res.json()});
    const folders = [];
    for (let i = 0; i < jsonObj.length; i++) {
        const subJson = jsonObj[i];
        filePath = subJson.files_url;
        folders.push(new Folder({
            folder_name: subJson.name,
            files: await fillFiles(filePath)
        }));
    }
    console.log('folders filled');
    return folders;
}

async function fillFiles(filePath) {
    const jsonObj = await fetch(new Request(filePath, options))
        .then(res => {return res.json()});
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