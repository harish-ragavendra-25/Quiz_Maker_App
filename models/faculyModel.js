const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const saltNum = parseInt(process.env.saltNum);

const facultySchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
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
