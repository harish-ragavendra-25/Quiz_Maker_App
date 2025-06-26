const studentModel = require('../models/studentModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;

const studentRegister = async(req,res) => {
    try {
        const { userName,password } = req.body;
        
        if(!userName || !password){
            return res.status(400).json({message:"Ensure all fields are filled"});
        }

        const existingUser = await studentModel.findOne({ userName });
        if(existingUser){
            return res.status(400).json({message: "user already exist!!"});
        }

        const newStudent = new studentModel({
            userName,
            password
        });

        await newStudent.save();

        res.status(201).json({message: `${newStudent.userName} registered successfully!!`});
    } catch (error) {
        console.log("..............student creation error!.........");
        console.log(error);
        res.status(500).json({message: 'Something went wrong!!...'});
    }
}

const studentLogin = async(req,res) => {
    try {
        const { userName,password } = req.body;

        if(!userName||!password){
            return res.status(400).json({message: 'All fields are required!!'});
        }

        const user = await studentModel.findOne({userName});
        if(!user){
            return res.status(404).json({message: `user with ${userName} not found !!`});
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            return res.status(404).json({message: `Invalid password credentials !!`});
        }

        if(!JWT_SECRET){
            return res.status(500).json({message: "JWT_SECRET NOT FOUND!!"});
        }

        // token sign
        const token = jwt.sign(
            {id:user._id,role:user.role},
            JWT_SECRET,
            {expiresIn:'1d'}
        );

        return res.status(200).json({
            message: 'login sucessful',
            token,
            user:{
                userName: user.userName,
                role: user.role
            }
        })
        
    } catch (error) {
        console.log("......................studentController.......................");
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
}

const studentCredentialsUpdate = async(req,res) => {
    try {

        const logged_student_id = req.user.id;
        const { newUserName,newPassword,oldPassword } = req.body;

        if(!oldPassword){
            return res.status(400).json({message: "Old Password required..."});
        }

        const logged_student = await studentModel.findById(logged_student_id);

        if(!logged_student){
            return res.status(404).json({message: "Student not found..."});
        }

        const isMatch = await bcrypt.compare(oldPassword,logged_student.password);

        if(!isMatch){
            return res.status(401).json({message: "Old Password Incorrect..."});
        }

        if(newUserName){
            logged_student.userName = newUserName;
        }
        if(newPassword){
            logged_student.password = newPassword;
        }
        await logged_student.save();
        return res.status(200).json({message: "Updated the student details..."});
    } catch (error) {
        console.log("Student credentials updation(Student-Controller)...");
        console.log(error);
        return res.status(500).json({message: 'Something went wrong...'});
    }
}


module.exports = {studentRegister,studentLogin,studentCredentialsUpdate};