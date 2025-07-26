const studentModel = require('../models/studentModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;

const questionModel = require('../models/questionModel');
const questionSetModel = require('../models/questionSetModel');
const testSessionModel = require('../models/testSessionModel');
const courseMappingModel = require('../models/courseMappingModel');

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

        if(existingUser.isBlocked){
            return res.status(403).json({message: "Account is blocked"});
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

const getLoggedStudentDetails = async(req,res) => {
    try {
        const logged_student_id = req.user.id;
        const student = await studentModel
                                .findById(logged_student_id)
                                .select('-password')
                                .populate('enrolledCourse','courseCode courseName dept');

        if(!student){
            return res.status(404).json({message: 'Student not found'});
        }

        return res.status(200).json({
            message: 'Student Details Fetched',
            student
        });
    } catch (error) {
        console.log("Student Controller(getLoggedDetails)");
        console.log(error);
        return res.status(500).json({message: 'Something went wrong...'});
    }
}

const listOfEnrolledCourses = async(req,res) => {
    try {
        const logged_student_id = req.user.id;

        const student = await studentModel.findById(logged_student_id)
                                          .populate({
                                            path: 'enrolledCourse',
                                            populate: {
                                                path: 'course',
                                                select: 'courseCode courseName courseCategory'
                                            },
                                            select: 'course'
                                          });
        if(!student){
            return res.status(404).json({message: 'Student not found'});
        }

        const enrolledCourses = student.enrolledCourse.map((course) => ({
            mappingId: course._id,
            courseCode: course.course.courseCode,
            courseName: course.course.courseName,
            courseCategory: course.course.courseCategory
        }));

        return res.status(200).json({
            message: "List Of Enrolled Course Fetched Successfully",
            enrolledCourses
        });
    } catch (error) {
        console.log("Student Controller(ListOfEnrolledCourses)");
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
}

const listQuestionSetOfCourseMapping = async(req,res) => {
    try {
        const { mappingId } = req.params;
        if(!mongoose.Types.ObjectId.isValid(mappingId)){
            return res.status(400).json({message: 'Invalid Course Mapping Id'});
        }

        const questionSets = await questionSetModel.find({courseMapping: mappingId});

        return res.status(200).json({
            message: "Question Set for the Given Mapping is fetched",
            questionSets
        });
    } catch (error) {
        console.log("Faculty Controller(listQuestionSetOfCourseMapping)");
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
}

const createTestSession = async(req,res) => {
    try{
        const logged_student_id = req.user.id;
        const { courseMappingId,questionSetId } = req.body;

        if(!questionSetId){
            return res.status(400).json({message: "QuestionSetId not found"});
        }
        if(!courseMappingId){
            return res.status(400).json({message: "courseMappingId not found"});
        }

        const questionSet = await questionSetModel.findById(questionSetId);
        if(!questionSet || !questionSet.isActive){
            return res.status(404).json({message: `Active QuestionSet not found`});
        }

        const mapping = await courseMappingModel.findById(courseMappingId);
        if(!mapping){
            return res.status(404).json({message: "Course Mapping Not Found"});
        }

        // Check Logged Student Enrolled In Particular Course Mapping
        const isEnrolled = mapping.student.some(
            (id) => id.toString() === logged_student_id.toString()
        );

        if(!isEnrolled){
            return res.status(403).json({
                message: "You're not enrolled in particular course"
            });
        }

        const existingSession = await testSessionModel.findOne({
            student: logged_student_id,
            courseMapping: courseMappingId,
            questionSet: questionSetId,
            status: 'pending'
        });

        if(existingSession){
            return res.status(200).json({
                message: 'You already have a active session',
                testSession: existingSession,
                endTime: existingSession.endTime
            });
        }

        const completedAttempts = await testSessionModel.countDocuments({
            student: logged_student_id,
            courseMapping: courseMappingId,
            questionSet: questionSetId,
            status: 'completed'
        });

        if(questionSet.attemptsAllowed <= completedAttempts){
            return res.status(403).json({message: `Max attempts of ${questionSet.attemptsAllowed} reached for ${questionSet.label}`});
        }

        const startedAt = new Date();
        const endTime = new Date(startedAt.getTime() + questionSet.durationOfTest * 1000);
        
        // create a test session
        const newTestSession = new testSessionModel({
            student: logged_student_id,
            faculty: questionSet.createdBy,
            courseMapping: courseMappingId,
            questionSet: questionSetId,
            startedAt,
            endTime,
            status: 'pending'
        });

        await newTestSession.save();
        return res.status(201).json({
            message: "Test Session Created Successfully",
            testSession: newTestSession,
            endTime
        });
    } catch (error) {
        console.log("Student Controller (createTestSession)");
        console.log(error);
        return res.status(500).json({message: "Something went wrong"});
    }
} 

const updateAnswerTestSession = async(req,res) => {
    try {
        const { testSessionId } = req.params;
        const { questionId,selectedOption } = req.body;

        if(!testSessionId||!questionId||!selectedOption){
            return res.status(400).json({message: 'missing fields'});
        }

        const testSession = await testSessionModel.findById(testSessionId);
        if(!testSession){
            return res.status(404).json({message: 'TestSession not found'});
        }

        if(testSession.status !== "pending"){
            return res.status(403).json({message: "Test Session is Already Closed"});
        }

        const question = await questionModel.findById(questionId);
        if(!question){
            return res.status(404).json({message: "Question not found"});
        }

        const isCorrect = selectedOption === question.correctAnswer;

        const existingAnswerIndex = testSession.answer.findIndex(
            a => a.question.toString() === questionId
        );

        if(existingAnswerIndex !== -1){
            const oldAns = testSession.answer[existingAnswerIndex];
            if(oldAns.isCorrect){
                testSession.score -= question.mark;
            }
            testSession.answer[existingAnswerIndex] = {
                question: questionId,
                selectedOption,
                isCorrect
            };
        }
        else{
            testSession.answer.push(
                {
                    question: questionId,
                    selectedOption,
                    isCorrect
                }
            );
        }

        if(isCorrect){
            testSession.score += question.mark;
        }

        await testSession.save();

        return res.status(200).json({
            message: "answer updated",
            testSession
        })
    } catch (error) {
        console.log("Student Controller (updateAnswerTestSession)");
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

const submitTestSession = async(req,res) => {
    try {
        const { testSessionId } = req.params;
        const session = await testSessionModel.findById(testSessionId);
        if(!session){
            return res.status(404).json({message: "Test Session Not Found"});
        }

        if(session.status === 'completed'){
            return res.status(400).json({message: "Test Session Already Completed"});
        }

        session.status = 'completed';
        session.submittedAt = new Date();
        session.durationTaken = Math.floor((session.submittedAt - session.startedAt)/60000);

        await session.save();
        return res.status(200).json({
            message: "Test Session submitted Successfully",
            score: session.score,
            durationTaken: session.durationTaken,
            submittedAt: session.submittedAt,
            testSession: session
        });
    } catch (error) {
        console.log("Student Controller (SubmitTestSession)");
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

const listAllSessionsOfMappings = async(req,res) => {
    try {
        const logged_student_id = req.user.id;
        const { courseMappingId } = req.params;
        
        const mapping = await courseMappingModel.findById(courseMappingId);
        if(!mapping){
            return res.status(404).json({message: 'Mapping not found'});
        }

        const testSessions = await testSessionModel.find({
            student: logged_student_id,
            courseMapping: courseMappingId,
            status: 'completed'
        })
        .populate({
            path: 'questionSet',
            select: 'label durationOfTest'
        })
        .populate({
            path: 'answer.question',
            select: 'questionText options correctAnswer mark'
        })
        .sort({submittedAt: -1});

        return res.status(200).json({
            message: "Test Session Reviews Fetched Successfully",
            testAttempts: testSessions
        });
    } catch (error) {
        console.log("Student Controller(listAllSessionsOfMappings)");
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

module.exports = {
    studentRegister,
    studentLogin,
    studentCredentialsUpdate,
    getLoggedStudentDetails,
    listOfEnrolledCourses,
    listQuestionSetOfCourseMapping,
    createTestSession,
    updateAnswerTestSession,
    submitTestSession,
    listAllSessionsOfMappings
};