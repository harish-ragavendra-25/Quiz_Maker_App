const adminModel = require('../models/adminModel');
const courseModel = require('../models/courseModel');
const courseMappingModel = require('../models/courseMappingModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const facultyModel = require('../models/faculyModel');
const studentModel = require('../models/studentModel');
const { default: mongoose, set } = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET;

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
        const { courseCode,courseName,courseCategory,description } = req.body;

        if(!courseCode || !courseName){
            return res.status(400).json({message: "Course Code and Course Name is requried..."});
        }

        if(!courseCategory){
            return res.status(400).json({message: "Course Category required..."});
        }

        if(!description){
            return res.status(400).json({message: "Add Course Description..."});
        }
        

        const existing = await courseModel.findOne({ $or: [ {courseCode} , {courseName} ]});
        if(existing){
            return res.status(400).json({message: 'Course with the same Name or Code already exists...'});
        }

        const newCourse = new courseModel({courseCode,courseName,courseCategory,description});
        await newCourse.save();

        return res.status(201).json({message: `${courseCode} - ${courseName} created Successfully...`,course: newCourse});
    } catch (error) {
        console.log("Error in creating Course");
        return res.status(500).json({ message: 'Something went wrong...'});
    }
}

const addFaculty = async(req,res) => {
    try {
        const { userName,password,name,dept } = req.body;
        if(!userName || !password) {
            return res.status(400).json({message: "UserName and Password are required..."});
        } 
        if(!name){
            return res.status(400).json({message: "its tough to call without name..."});
        }
        if(!dept){
            return res.status(400).json({message: "Department are required..."});
        }

        const isExist = await facultyModel.findOne({ userName });
        if(isExist){
            return res.status(400).json({ message: `Faculty with userName: ${userName} already Exist...`});
        }

        const newFaculty = new facultyModel({ userName,password,dept,name });
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
        const { userName,password,name,dept } = req.body;
        
        if(!userName || !password){
            return res.status(400).json({message: "UserName and Password Fields are required..."});
        }
        
        if(!dept){
            return res.status(400).json({message: "Department Field are required..."});
        }

        const isExist = await studentModel.findOne({ userName });
        if(isExist){
            return res.status(400).json({message: `Student with userName: ${userName} already Exist...`});
        }

        const newStudent = new studentModel({ userName,password,name,dept });
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

const listAllStudents = async(req,res) => {
    try {
        const listOfStudents = await studentModel.find({},{password: 0});
        return res.status(200).json({listOfStudents});
    } catch (error) {
        console.log("listAllStudents function (adminController)");
        console.log(error);
        return res.status(500).json({message: "server error on fetching list of students..."});
    }
}

const listAllCourses = async(req,res) => {
    try {
        const listOfCourses = await courseModel.find();
        console.log(listAllCourses);
        return res.status(200).json({listAllCourses});
    } catch (error) {
        console.log("listAllCourse function(adminController)");
        console.log(error);
        return res.status(500).json({message: "Server error on fetching list of courses..."});
    }
}

const adminUpdationOfFacultyDetails = async(req,res) => {
    try {
        const {facultyId} = req.params;
        if(!facultyId){
            return res.status(400).json({message: "Faculty Id is required"});
        }
        const {userName,dept,isBlocked} = req.body;

        const faculty = await facultyModel.findById(facultyId);
        if(!faculty){
            return res.status(404).json({message: "Faculty not found..."});
        }

        if(userName) faculty.userName = userName;
        if(dept) faculty.dept = dept;
        if(typeof isBlocked === 'boolean') faculty.isBlocked = isBlocked;

        await faculty.save();
        return res.status(200).json({message: `faculty - ${faculty.userName} details updated`});
    } catch (error) {
        console.log("updation of faculty Details (AdminController)");
        console.log(error);
        return res.status(500).json({message: "Server error on upation of details"});
    }
}

const adminUpdationOfStudentDetails = async(req,res) => {
    try {
        const {studentId} = req.params;
        const {userName,dept,isBlocked} = req.body;

        if(!studentId){
            return res.status(400).json({message: "Student Id is required"});
        }
        const student = await studentModel.findById(studentId);
        if(!student){
            return res.status(404).json({message: "Student not found..."});
        }

        if(userName) student.userName = userName;
        if(dept) student.dept = dept;
        if(typeof isBlocked === 'boolean') student.isBlocked = isBlocked;

        await student.save();
        return res.status(200).json({message: `student - ${student.userName} details updated`});
    } catch (error) {
        console.log("updation of student Details (AdminController)");
        console.log(error);
        return res.status(500).json({message: "Server error on upation of details"});
    }
}

const mapFacultyToCourse = async(req,res) => {
    try {
        const {facultyUserName,courseCode} = req.body;
        if(!facultyUserName || !courseCode){
            return res.status(400).json({message: "Faculty userName and Course code is required"});
        }
        
        // course should Exist 
        const course = await courseModel.findOne({courseCode: courseCode});
        if(!course){
            return res.status(400).json({message: `course: ${courseCode} not found`});
        }
        
        // faculty should exist
        const faculty = await facultyModel.findOne({userName: facultyUserName});
        if(!faculty){
            return res.status(400).json({message: `faculty: ${facultyUserName} not found `});
        }

        // check for existing mapping
        const existedMap = await courseMappingModel.findOne({faculty: faculty._id,course: course._id});
        if(existedMap){
            return res.status(400).json({message: "FacultyId and CourseId is already Mapped..."});
        }

        const newMapping = new courseMappingModel({
            faculty: faculty._id,
            course: course._id,
            student: [],
            questionSets: []
        });

        faculty.assignedCourses.push(newMapping._id);
        await faculty.save();
        await newMapping.save();    
        return res.status(200).json({message: "Faculty Mapped succesfully to the Course",mapping: newMapping});
    } catch (error) {
        console.log("mapFacultyToCourse function (admin Controller)");
        console.log(error);
        return res.status(500).json({message: "server error: try again!!"});
    }
}

const mapStudentIdsToCourseId = async(req,res) => {
    try {
        const { mappingId,studentIds } = req.body;
        
        if(!mappingId){
            return res.status(400).json({message: "MappingId not found"});
        }

        if(!Array.isArray(studentIds) || studentIds.length === 0){
            return res.status(400).json({message: "StudentIds are required"});
        }

        const mapping = await courseMappingModel.findById(mappingId);
        if(!mapping){
            return res.status(404).json({message: "Course Mapping not found..."});
        }
        const validIds = studentIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
        const uniqueStudentIds = [
            ...new Set(
                [...mapping.student.map((id) => id.toString()),
                ...validIds]
            )
        ];
        mapping.student = uniqueStudentIds;

        await Promise.all(validIds.map(async(studentId) => {
            await studentModel.findByIdAndUpdate(
                studentId,
                { $addToSet: { enrolledCourse: mapping._id }},
                { new: true }
            )
        }));

        await mapping.save();
        return res.status(200).json({
            message: "Student mapped successfully...",
            mapping
        });
    } catch (error) {
        console.log("mapStudentIDtoCourseId function(admin controller)");
        console.log(error);
        return res.status(500).json({message: "server error: try again!!"});        
    }
}

const deleteStudent = async(req,res) => {
    try {
        const {studentId} = req.body;
    
        if(!mongoose.Types.ObjectId.isValid(studentId)){
            return res.status(400).json({message: "Student Id requried..."});
        }

        const deletedStudent = await studentModel.findByIdAndDelete(studentId);
        if(!deleteStudent){
            return res.status(400).json({message: `student not found...`});
        }

        await courseMappingModel.updateMany(
            {student: studentId},
            { $pull: {student:studentId}}
        );
        
        return res.status(200).json({
            message: `Student: ${deletedStudent.userName} is deleted and removed from all course Mappings`
        });
    } catch (error) {
        console.log("deleted Student: (admin controller)");
        console.log(error);
        return res.status(500).json({message: "Server error: try again!!"});
    }
}

const deleteFaculty = async(req,res) => {
    try {
        const {facultyId} = req.body;

        if(!mongoose.Types.ObjectId.isValid(facultyId)){
            return res.status(400).json({message: "Faculty Id required..."});
        }

        const deletedFaculty = await facultyModel.findByIdAndDelete(facultyId);
        if(!deleteFaculty){
            return res.status(400).json({message: `faculty not found`});
        }

        await courseMappingModel.updateMany(
            {faculty: facultyId},
            {$pull: {faculty: facultyId}}
        );

        return res.status(200).json({message: `${deletedFaculty.name} is deleted and removed all course Mapping Sucessfully...`});
    } catch (error) {
        console.log("deleted Faculty: (admin controller)");
        console.log(error);
        return res.status(500).json({message: "Server error: try again!!"});
    }
}

module.exports = {
    adminRegister,
    adminLogin,
    adminCredentialsUpdate,
    addCourse,
    addFaculty,
    addStudent,
    listAllFaculty,
    listAllStudents,
    listAllCourses,
    adminUpdationOfFacultyDetails,
    adminUpdationOfStudentDetails,
    mapFacultyToCourse,
    mapStudentIdsToCourseId,
    deleteStudent,
    deleteFaculty
};