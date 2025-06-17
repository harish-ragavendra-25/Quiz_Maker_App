const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const saltNum = parseInt(process.env.saltNum);

const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'admin'
    }
});

adminSchema.pre('save',async function(next) {
    try {
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password,saltNum);
        };
        next();
    } catch (error) {
        next(error);
    }
})

const adminModel = new mongoose.model("adminModel",adminSchema);
module.exports = adminModel;