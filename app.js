const express = require('express');
const mongoose = require('mongoose');
const File = require('./model/file');

const app = express();

const dbUrl = 
mongoose.connect(dbUrl)
.then((res) => app.listen(3000))
.catch(e => console.log(e));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
})