const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const mongoose = require('mongoose');

const dotenv = require('dotenv').config();
const db_connection = require('./config/db_connection');
db_connection();

const authRoute = require('./routers/authRoute');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//for Admins
app.use('/api/auth',authRoute);

app.use((req, res) => {
    res.status(404).send("Invalid URL");
});

app.listen(PORT,() => {
    console.log(`Server listening to ${PORT}`);
})