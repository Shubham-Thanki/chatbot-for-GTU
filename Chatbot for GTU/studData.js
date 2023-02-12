const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://amit1108:amit%401108@cluster0.yjt4ycq.mongodb.net/studentsDB",
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected");
    }
  }
);

const studentData = new Schema({
  enrollment: Number,
  name: String,
  semFeeStatus: Boolean,
  contact: String,
  branch: String,
  result: String,
  examFeeStatus: Boolean,
  sem: Number,
});

const semSubject = new Schema({
  sem: Number,
  // branchName:String,
  subjects: Array,
});

const subInfo = new Schema({
  subject: String,
  syllabus: String,
});

const semSubjects = mongoose.model('mysubject', semSubject);
const subInfos = mongoose.model('subInfo', subInfo);
const studentTable = mongoose.model('student', studentData);
// console.log(studentTable);
module.exports = { studentTable, semSubjects, subInfos };
