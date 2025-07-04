const facultyModel = require('../models/faculyModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;

const facultyRegister = async(req,res) => {
    try {
        const { userName,password } = req.body;
        
        if(!userName || !password){
            return res.status(400).json({message:"Ensure all fields are filled"});
        }

        const existingUser = await facultyModel.findOne({ userName });
        if(existingUser){
            return res.status(400).json({message: "user already exist!!"});
        }

        const newFaculty = new facultyModel({
            userName,
            password
        });

        await newFaculty.save();

        res.status(201).json({message: `${newFaculty.userName} registered successfully!!`});
    } catch (error) {
        console.log("..............Faculty creation error!!(facultyController).........");
        console.log(error);
        res.status(500).json({message: 'Something went wrong!!...'});
    }
}

const facultyLogin = async(req,res) => {
    try {
        const { userName,password } = req.body;

        if(!userName||!password){
            return res.status(400).json({message: 'All fields are required!!'});
        }

        const user = await facultyModel.findOne({userName});
        if(!user){
            return res.status(404).json({message: `user with ${userName} not found !!`});
        }

        if(user.isBlocked){
            return res.status(403).json({message: "Account is blocked"});
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
        console.log("......................FacultyController(FacultyLogin).......................");
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
}

const facultyCredentialsUpdate = async(req,res) => {
    try {

        const logged_faculty_id = req.user.id;
        const { newUserName,newPassword,oldPassword } = req.body;

        if(!oldPassword){
            return res.status(400).json({message: "Old Password required..."});
        }

        const logged_faculty = await facultyModel.findById(logged_faculty_id);

        if(!logged_faculty){
            return res.status(404).json({message: "Faculty not found..."});
        }

        if(logged_faculty.isBlocked){
            return res.status(403).json({message: "Account is blocked"});
        }

        const isMatch = await bcrypt.compare(oldPassword,logged_faculty.password);

        if(!isMatch){
            return res.status(401).json({message: "Old Password Incorrect..."});
        }

        if(newUserName){
            logged_faculty.userName = newUserName;
        }
        if(newPassword){
            logged_faculty.password = newPassword;
        }
        await logged_faculty.save();
        return res.status(200).json({message: "Updated the faculty details..."});
    } catch (error) {
        console.log("Faculty credentials updation(facutly-Controller)...");
        console.log(error);
        return res.status(500).json({message: 'Something went wrong...'});
    }
}

module.exports = {facultyRegister,facultyLogin,facultyCredentialsUpdate};