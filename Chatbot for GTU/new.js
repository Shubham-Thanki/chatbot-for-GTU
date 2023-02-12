const fs = require("fs");
let courseData = {};
let studentsData = {};

// READING COURSE-BRANCH JSON FILE
const jsonStringCourse = fs.readFileSync(
  "./course_branch.json",
  "utf-8",
  (err) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
  }
);
courseData = JSON.parse(jsonStringCourse);

// READING STUDENTS JSON FILE
const jsonStringStudent = fs.readFileSync("./students.json", "utf-8", (err) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
});
studentsData = JSON.parse(jsonStringStudent);
module.exports = {
  initial_msg: `👋\nReply with an appropriate option.\n\n 🔍 *Informative Section*: you will find all the useful stuff which will be useful to you.\n\n1️⃣ *Course* details.\n2️⃣ *Personal* details.\n3️⃣ *Get the latest circular* details.\n
  𝐃 *List of degrees*:\n📚 *Academics Section*: Information related to academics.\n\n4️⃣Previous year *question papers* of gtu.\n5️⃣ Get *Bonafide Certificate*.\n6️⃣  Want to *build resume*?.\n7️⃣ Get *Design Engineering* material\n8️⃣ Raise a *Query*\n9️⃣ *Quit*`,
  course_details: `Which course you want to know about ?\n\n◾ CE(Computer Engineering)\n◾ IT(Information Technology)\n◾ ICT(Information and Communication Technology)\n◾ ME(Mechanical Engineering)\n◾ CL(Civil Engineering)`,
  paper_details: `➡️ CE-P(computer Engineering Papers)\n➡️ ME-P(Mechanical Engineering Papers)\n➡️ CL-P(Civil Engineering Papers)\n➡️ CEM-P(Chemical Engineering Papers)\n➡️ IT-P(Information Technology Papers)\n➡️ ICT-P(Information and communication Technology Papers)\n`,
  bonafidemsg: `◾ A photocopy of the College ID card thus attached with the Application form.\n◾ A copy of the latest fee receipt is thus to be attached with the above form. To make sure that the child is still a student of the college.`,
  query: `You can contact us on\n📞 079-23267521 / 079-23267570 \n📧 info@gtu.ac.in / registrar@gtu.ac.in\n📝 https://forms.gle/vfmQaWPWvwsFQcCb6`,
  quit: `Thank you for using GTU bot, looking forward to see you again`,
};
