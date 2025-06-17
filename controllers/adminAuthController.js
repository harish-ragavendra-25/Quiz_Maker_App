const adminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
            res.status(400).json({message: 'All fields are required!!'});
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
            {id:user._id},
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
        res.status(500).json({message: "Something went wrong"});
    }
}

module.exports = {adminRegister,adminLogin};