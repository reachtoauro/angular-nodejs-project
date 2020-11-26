const express = require('express');
const bodyParser = require('body-parser');
const moogoose = require('mongoose');
const path = require('path');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
var app = express();

require('dotenv').config() 
const host = process.env.DB_URL;
const user = process.env.DB_USER;
const password = process.env.DB_PWD;


moogoose.connect('mongodb+srv://' + user + ':' + password + '@' + host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        console.log('Connected to database.');
        console.log('Application started!!');
    })
    .catch((err) => {
        console.error('Connected failed '+err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
module.exports = app;