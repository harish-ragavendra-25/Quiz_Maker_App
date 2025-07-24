const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const saltNum = parseInt(process.env.saltNum);

const facultySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true
  },
  dept:{
    type: String,
    enum: ['AIDS','CSE','IT','IOT','ECE','E&I','TRAINING','MECH','CIVIL','BIO MEDICAL'],
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  assignedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courseMappingModel",
    },
  ],
  role: {
    type: String,
    default: 'faculty'
  }
});

facultySchema.pre('save',async function(next){
  try {
    if(this.isModified('password')){
      this.password = await bcrypt.hash(this.password,saltNum);
    };
  } catch (error) {
    next(error);
  }
})

const facultyModel = new mongoose.model("facultyModel", facultySchema);
module.exports = facultyModel;
