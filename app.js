const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');

const dotenv = require('dotenv').config();
const db_connection = require('./config/db_connection');
db_connection();

app.use('/',(req,res) => {
    res.send("hello world");
})

app.listen(PORT,() => {
    console.log(`Server listening to ${PORT}`);
})