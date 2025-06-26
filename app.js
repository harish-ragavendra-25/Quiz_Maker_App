const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const mongoose = require('mongoose');

const dotenv = require('dotenv').config();
const db_connection = require('./config/db_connection');
db_connection();

const authRoute = require('./routers/authRoute');
const adminRoute = require('./routers/adminRoute');
const facultyRoute = require('./routers/facultyRoute');
const studentRoute = require('./routers/studentRoute');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//for Auth
app.use('/api/auth',authRoute);

// for Admin
app.use('/api/admin',adminRoute);

// for faculty
app.use('/api/faculty',facultyRoute);

// for student
app.use('/api/student',studentRoute);


app.use((req, res) => {
    res.status(404).send("Invalid URL");
});

app.listen(PORT,() => {
    console.log(`Server listening to ${PORT}`);
})