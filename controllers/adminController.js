const adminModel = require('../models/adminModel');
const courseModel = require('../models/courseModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const facultyModel = require('../models/faculyModel');
const studentModel = require('../models/studentModel');

const JWT_SECRET = process.env.JWT_SECRET;
const saltNum = parseInt(process.env.saltNum);

const adminRegister = async(req,res) => {
    try {
        const { userName,password } = req.body;
        
        if(!userName || !password){
            return res.status(400).json({message:"Ensure all fields are filled"});
        }

        const existingUser = await adminModel.findOne({ userName });
        if(existingUser){
            return res.status(400).json({message: "user already exist!!"});
        }

        const newAdmin = new adminModel({
            userName,
            password
        });

        await newAdmin.save();

        res.status(201).json({message: `${newAdmin.userName} registered successfully!!`});
    } catch (error) {
        console.log("..............admin creation error!!(adminAuthController).........");
        console.log(error);
        res.status(500).json({message: 'Something went wrong!!...'});
    }
}

const adminLogin = async(req,res) => {
    try {
        const { userName,password } = req.body;

        if(!userName||!password){
            return res.status(400).json({message: 'All fields are required!!'});
        }

        const user = await adminModel.findOne({userName});
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
        console.log("......................adminAuthController(adminLogin).......................");
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
}

const adminCredentialsUpdate = async(req,res) => {
    try {
        const logged_adminId = req.user.id;
        const {oldPassword,newUserName,newPassword} = req.body;

        if(!oldPassword){
            return res.status(400).json({message: 'Old password required...'});
        }

        const admin = await adminModel.findById(logged_adminId);
        if(!admin){
            return res.status(404).json({message: "Admin not found..."});
        }
        
        const isMatch = await bcrypt.compare(oldPassword,admin.password);
        if(!isMatch){
            return res.status(401).json({message: "Old Password Incorrect..."});
        }

        if(newUserName){
            admin.userName = newUserName;
        }
        if(newPassword){
            admin.password = newPassword;
        }
        await admin.save();
        return res.status(200).json({message: `${admin.userName} credentials updated...!!`});
    } catch (error) {
        console.log("adminCredentialsUpdate (admin controller)...");
        console.log(error);
        return res.status(500).json({message:"Something went wrong."});
    }
}

const addCourse = async(req,res) => {
    try {
        const { courseCode,courseName,description } = req.body;

        if(!courseCode || !courseName){
            return res.status(400).json({message: "Course Code and Course Name is requried..."});
        }

        const existing = await courseModel.findOne({ $or: [ {courseCode} , {courseName} ]});
        if(existing){
            return res.status(400).json({message: 'Course with the same Name or Code already exists...'});
        }

        const newCourse = new courseModel({courseCode,courseName,description});
        await newCourse.save();

        return res.status(201).json({message: `${courseCode} - ${courseName} created Successfully...`,course: newCourse});
    } catch (error) {
        console.log("Error in creating Course");
        return res.status(500).json({ message: 'Something went wrong...'});
    }
}

const addFaculty = async(req,res) => {
    try {
        const { userName,password } = req.body;
        if(!userName || !password) {
            return res.status(400).json({message: "UserName and Password Fields are required...!!"});
        } 

        const isExist = await facultyModel.findOne({ userName });
        if(isExist){
            return res.status(400).json({ message: `Faculty with userName: ${userName} already Exist...`});
        }

        const newFaculty = new facultyModel({ userName,password });
        await newFaculty.save();

        return res.status(201).json({message: `Faculty ${userName} Created Successfully...`,faculty: newFaculty});
    } catch (error) {
        console.log("Faculty creation error(Admin controller -> Add Faculty Function)");
        console.log(error);
        return res.status(500).json({message: "Something went wrong..."});
    }
}

const addStudent = async(req,res) => {
    try {
        const { userName,password } = req.body;
        
        if(!userName || !password){
            return res.status(400).json({message: "UserName and Password Fields are required..."});
        }

        const isExist = await studentModel.findOne({ userName });
        if(isExist){
            return res.status(400).json({message: `Student with userName: ${userName} already Exist...`});
        }

        const newStudent = new studentModel({ userName,password });
        await newStudent.save();
        return res.status(201).json({message: `Student ${userName} created Sucessfully`,student: newStudent});
    } catch (error) {
        console.log("Student Creation function (Admin Controller -> addStudent)");
        console.log(error);
        return res.status(500).json({message: "Something went wrong..."});
    }
}

const listAllFaculty = async(req,res) => {
    try {
        const listOfFaculty = await facultyModel.find({},{password:0});
        return res.status(200).json({listOfFaculty});
    } catch (error) {
        console.log("listAllFaculty function (adminController)");
        console.log(error);
        return res.status(500).json({message: "server error on fetching list of faculty..."});
    }
}



module.exports = {
    adminRegister,
    adminLogin,
    adminCredentialsUpdate,
    addCourse,
    addFaculty,
    addStudent,
    listAllFaculty
};