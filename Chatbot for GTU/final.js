const { MessageMedia, Client, LocalAuth } = require("whatsapp-web.js");
const finalName = require("./new");
const path = require("path");
// const mongoose = require("mongoose");
const { studentTable, semSubjects, subInfos } = require("./studData");
// console.log(studentTable.)
const courseModel = require("./courseDetails");
// const studentTable = require("./studData");

// <-----------------Using express for fetching data---------------------->
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join("public")));
app.get("/home", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/impsubmit", function (req, res, next) {
  console.log(req.query);
  // const{title,exampleInputMessage,files}=req.query;
  sendASAP(req.query);
  // sendSemDetails(req.query);
  res.redirect("/home");
});

app.get("/feealert", function (req, res, next) {
  const { date, month, year, hour, minute } = req.query;
  // console.log(req.query);
  let newDate = new Date(year, month - 1, date, hour, minute).getTime();
  timelyUpdate(req.query, newDate);
  res.redirect("/home");
});

app.listen(7000);

// mongoose.createConnection("mongodb+srv://amit1108:amit%401108@cluster0.yjt4ycq.mongodb.net/studentsDB");
let sessionFlag = false;
let flag = false;
let ca1 = (ca2 = ca4 = false);
function cases(c1, c2, c3) {
  c1 = true;
  c2 = false;
  c3 = false;
  arr = [c1, c2, c3];
  return arr;
}

//<----------------------------FOR DATABASE-------------------->
let fee = false;

async function findStud(id) {
  console.log(id);
  let stud = await studentTable.find({ contact: id });
  if (stud.length > 0) {
    return true;
  } else {
    return false;
  }
}
//<----------------------------FOR DATABASE-------------------->

//<===========================FOR FEE ALERT=========================>
async function feeAlert(numFees) {
  if (!numFees[1]) {
    await client.sendMessage(numFees[0], "Please pay the fees!!");
  } else {
    await client.sendMessage(numFees[0], "Please do not pay the fees!!");
  }
}

//trigger on fees alert
async function sendASAP(msg) {
  const { updateCheckbox } = msg;
  let arr = [];
  if (typeof updateCheckbox === "string") {
    arr.push(updateCheckbox);
  } else {
    arr = updateCheckbox;
  }
  // console.log(arr);
  let anotherArr = arr.map((el) => el.split("-")[1]);
  // console.log(anotherArr);
  anotherArr.forEach(async (el) => {
    let query = await studentTable.find({ sem: el });
    console.log(query);
    let numFees = {};
    for (let i = 0; i < query.length; i++) {
      numFees[query[i].contact] = msg.exampleInputMessage;
    }
    let arr = Object.entries(numFees);
    // [[num,false]}
    arr.forEach(sendAlert);
  });
}

//<========================================FOR IMP. UPDATES==============================================>
async function sendAlert(arr, media = null) {
  try {
    console.log(arr);
    if (media) {
      let paymetQR = MessageMedia.fromFilePath("payment.jpg");
      await client.sendMessage(arr[0], paymetQR, { caption: arr[1] });
    } else {
      let file = MessageMedia.fromFilePath("latest_circular.pdf");
      await client.sendMessage(arr[0], file);
      await client.sendMessage(arr[0], arr[1]);
    }
  } catch (error) {
    console.log(error);
  }
}

// *-------------Fee Alert function starts------------------- *
//important update trigger

async function timelyUpdate(obj, date) {
  console.log("timely");
  let query,
    str = "";
  const { feeCategory, feeCheckbox } = obj;
  console.log(feeCategory, feeCheckbox);
  if (feeCategory === "current") {
    query = await studentTable.find({ examFeeStatus: false });
    str = "Please pay the current exam fees ";
  } else if (feeCategory === "remedial") {
    query = await studentTable.find({ backlog: true });
    str = `Please pay the remedial fees `;
  } else {
    query = await studentTable.find({ examFeeStatus: false, backlog: true });
    console.log(query.sem, typeof query.sem);
    str = `Please pay the current exam fees and also  remedial fees `;
  }
  // console.log(query);
  let temparr = [];
  if (typeof feeCheckbox === "string") {
    temparr.push(feeCheckbox);
  } else {
    temparr = feeCheckbox;
  }
  // console.log(temparr);
  let anotherArr = temparr.map((el) => el.split("-")[1]);
  // console.log(anotherArr);
  // console.log(anotherArr.includes(query.sem.toString()));
  // console.log(date - Date.now());
  let nums = {};
  for (let index = 0; index < query.length; index++) {
    if (anotherArr.includes(query[index].sem.toString())) {
      if (query[index].sem === 1) {
        nums[query[index].contact] = str;
      } else {
        nums[query[index].contact] = str + " of sem " + (query[index].sem - 1);
      }
    }
  }
  // console.log(nums);
  let arr = Object.entries(nums);
  // console.log(arr);
  // [[num,false]}
  setTimeout(() => arr.forEach(sendAlert, true), date - Date.now());
}

// let y = 2023
// let m = 1
// let d = 07
// let hr = 00
// let min = 05
//SET THE DATE HERE, FORMAT--->Year,Month,Date,Hour,Minute
// let date = new Date(y, m, d, hr, min);

//Converts the date to milliseconds.
// let datemili = date.getTime();
// sendUpdate(datemili);

// submit.addEventListener('click', sendUpdate(datemili));

//<===========================FOR DATE ENDS=========================>

// READING STUDENTS JSON FILE

async function fetchStudentDetails(enr) {
  const studDetails = await studentTable.find({ enrollment: enr });
  return studDetails;
}

async function fetchCourseDetails(branch, paper = false) {
  const courseDetails = await courseModel.find({
    branch: branch.toUpperCase(),
  });
  console.log(courseDetails);
  const { desc, companies, colleges, papers } = courseDetails[0];
  let str = "";
  if (paper) {
    papers.forEach((el) => (str += "\n" + el.year + "\n" + el.link + "\n"));
    str += "\n\nPress # to go back!👈";
    return str;
  } else {
    str += desc;
    companies.forEach(
      (el) => (str += "\n" + el.name + "\n" + el.size + "\n" + el.link + "\n")
    );
    colleges.forEach(
      (el) =>
        (str +=
          "\n" +
          el.name +
          "\n" +
          el.ownership +
          "\n" +
          el.established +
          "\n" +
          el.link +
          "\n" +
          el.fees +
          "\n")
    );
    str += "\n\nPress # to go back!👈";
    return str;
  }
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: false },
});
setTimeout(() => {
  sessionFlag = true;
}, 2000);
client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});
//
client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
  //   console.log(finalName);
});

client.on("auth_failure", (message) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", message);
});
// const replyData = studentsData[user_inp];
client.on("ready", async () => {
  console.log("READY and WORKING!");
  // feeBroadcast();
});

const initial_message = finalName.initial_msg;
client.on("message", async (message) => {
  if (sessionFlag) {
    // console.log('MESSAGE RECEIVED', message);
    //   const fs = require("fs");

    // console.log(typeof(message.body)){
    let case1 = false;
    let case2 = false;
    let case4 = false;
    let u = /^\d{12}$/;

    var user_inp = message.body.toUpperCase();

    //<---------------------------------DATABASE ACCESS---------------------------------->

    async function fetchCourseDetails() {
      //returns array of object; contains the record of student who sent the message
      //[{record}]
      const messageFrom = await studentTable.find({ contact: message.from });

      //yourSem=current semester of student
      const yourSem = messageFrom[0].sem;

      //record corresponding to yourSem
      const mySubDetails = await semSubjects.find({ sem: yourSem });

      let mySubInMySemObj = mySubDetails[0];
      let { subjects } = mySubInMySemObj;

      let str = "";
      for (let index = 0; index < subjects.length; index++) {
        // str = str + query[0].syllabus + "\n\n";
        let link = await findSyllabus(subjects[index]);
        str =
          str + "Here is a link to *" + subjects[index] + "* syllabus\n" + link;
      }

      sendSyllabus(str);

      async function sendSyllabus(syl) {
        await client.sendMessage(message.from, syl);
      }

      async function findSyllabus(ele) {
        let str = "";
        let query = await subInfos.find({ subject: ele });
        // console.log(query);
        // let str = "";
        str = str + query[0].syllabus + "\n\n";
        // await client.sendMessage("919687205427@c.us", str);
        return str;
      }
      // console.log(str);
      console.log(subjects);
      return `Details for your ${yourSem}th semester`;
    }

    //<---------------------------------DATABASE ENDS-------------------------------------->

    if (user_inp.match(u)) {
      // console.log("inside pattern test");
      // flag = true;
      const replyData = await fetchStudentDetails(user_inp);

      if (replyData.length === 0) {
        message.reply(
          "Enrollment Number not found.\n\nPlease enter a valid enrollment number."
        );
      } else {
        message
          .reply(
            `Your current semester is ${replyData[0].sem}  
              \nHere is a link to your result... ${replyData[0].result} 
              \nYour branch is ${replyData[0].branch}`
          )
          .toString();

        if (replyData[0].exmfee) {
          message.reply(
            "Fee Status : You have paid the fees." + "\n\nPress # to go back!👈"
          );
        } else {
          message.reply("Fee Status : You have not paid the fees.") +
            "\n\nPress # to go back!👈";
        }
      }
      return;
    } else {
      var user_inp = message.body.toUpperCase();
    }

    if (user_inp.startsWith("HI") || user_inp.startsWith("HE")) {
      const initial_media = MessageMedia.fromFilePath("gtu.jpg");
      const currentStudent = await studentTable.find({ contact: message.from });
      let studentName;
      if (currentStudent.length === 0) {
        studentName = ``;
      } else {
        studentName = currentStudent[0].name;
      }
      await client.sendMessage(message.from, initial_media, {
        caption: `Hello *${studentName}* ` + initial_message,
      });

      flag = true;
    } else if (flag) {
      const media = MessageMedia.fromFilePath("./latest_circular.pdf");
      const bonafide = MessageMedia.fromFilePath("./bonafide.pdf");

      //IN THIS WE NEED TO MENTION ALL THE COMMANDS : ( ALL MUST BE UNIQUE )
      // I PREFER WRITING TEXT INSTEAD OF WRITING NUMBERS

      switch (user_inp) {
        case "1":
          const details = await fetchCourseDetails();
          console.log(details);
          await client.sendMessage(message.from, details);
          [ca1, ca2, ca4] = cases(case1, case2, case4);
          break;
        case "2":
          message.reply("Enter your Enrollment number");
          [ca2, ca1, ca4] = cases(case2, case1, case4);
          break;
        case "3":
          await message.reply(media);
          message.reply("Press # to return to the main menu.");
          break;

        case "D":
          message.reply(
            "Type the shortcut mentioned below to get the details.\n\n*BA*: Bachelor of architecture\n\n*Bpharm*:Bachelor of pharmacy\n\n*BH*:bachelor of hotel management\n\n*BSC*:Bachelor of science\n\n*BBA*:Bachelor of business administrator\n\n*BMS*:Bachelor of management science\n\n*BJMC*:Bachelor of journalism and mass communication\n\n*BFD*:Bachelor of fashion designing\n\n*BSW*:Bachelor of social work\n\n*BBS*:Bachelor of business studies\n\n*BTTM*:Bachelor of travel tourism management\n*BSCHH*:Bsc in hospitality and hotel administrator\n\n*BDES*:Bachelor of design\n\n*BPA*:Bachelor of performing arts\n"
          );

          break;

        case "BA":
          message.reply(
            "*BA-SUB*:For subject information\n\n*BA-COL*:For colleges information"
          );
          break;

        case "BA-SUB":
          message.reply(
            "1:Advanced Visual Representation\n\n2:Electrical, HVAC, Fire Safety and Building Automation\n\n3:Environmental Sciences\n\n4:Applied Climatology\n\n5:Fundamental Architecture Studio"
          );
          break;

        case "BA-COL":
          message.reply(
            "1:Vastu Kala Academy, New Delhi\n\n2:Rachana Sansad's Academy of Architecture, Mumbai\n\n3:Noble Architecture College, Junagadh\n\n4:East West School of Architecture, Bangalore\n\n5:Amity School of Architecture and Planning, Noida, Uttar Pradesh"
          );
          break;

        case "Bpharm":
          message.reply(
            "*Bpharm-SUB*:For subject information\n\n*Bpharm-COL*:For colleges information"
          );
          break;

        case "Bpharm-SUB":
          message.reply(
            "1:Human Anatomy and Physiology\n\n2:Pharmaceutical Analysis\n\n3:Pharmaceutics\n\n4:Pharmaceutical Inorganic Chemistry\n\n5:Communication skills"
          );
          break;

        case "Bpharm-COL":
          message.reply(
            "1:Jamia Hamdard University, New Delhi\n\n2:Panjab University, Chandigarh\n\n3:Institute of Chemical Technology, Mumbai \n\n4:Birla Institute of Technology and Science (BITS), Pilani\n\n5:Manipal College of Pharmaceutical Sciences, Manipal"
          );
          break;

        case "BH":
          message.reply(
            "*BH-SUB*:For subject information\n\n*BH-COL*:For colleges information"
          );
          break;

        case "BH-SUB":
          message.reply(
            "1:Communication skills in English\n\n2:Hotel engineering\n\n3:Human resource management\n\n4:Nutrition\n\n5:Food production operations"
          );
          break;

        case "BH-COL":
          message.reply(
            "1:Institute of Hotel Management, Catering Technology and Applied Nutrition\n\n2:Institute of Hotel Management, Catering & Nutrition	Delhi\n\n3:Chandigarh University\n\n4:Lovely Professional University, Pilani\n\n5:Institute of Hotel Management, Catering Technology & Applied Nutrition	Hyderabad"
          );
          break;

        case "BSC":
          message.reply(
            "*BSC-SUB*:For subject information\n\n*BSC-COL*:For colleges information"
          );
          break;

        case "BSC-SUB":
          message.reply(
            "1:Mathematical Physics \n\n2:Mechanics\n\n3:Electricity and Magnetism\n\n4:Waves and Optics\n\n5:Chemistry"
          );
          break;

        case "BSC-COL":
          message.reply(
            "1:Delhi University (DU)\n\n2:BHU - Banaras Hindu University\n\n3:All India Institute of Medical Sciences, Delhi\n\n4:Malla Reddy University\n\n5:Chandigarh University (CU)"
          );
          break;

        case "BBA":
          message.reply(
            "*BBA-SUB*:For subject information\n\n*BBA-COL*:For colleges information"
          );
          break;

        case "BBA-SUB":
          message.reply(
            "1:Business Mathematics & Statics\n\n2Introduction to Operation Research\n\n3:Business Economics\n\n4:Financial & Management Accounting\n\n5:Production & Material Management"
          );
          break;

        case "BBA-COL":
          message.reply(
            "1:Indian Institute of Management, Indore\n\n2:Indian Institute of Management, Rohtak\n\n3:Indian Institute of Management, Ranchi\n\n4:SVKM’S NMIMS Anil Surendra Modi School Of Commerce\n\n5:Indian Institute of Foreign Trade"
          );
          break;

        case "4":
          message.reply(
            "Select your branch\n" +
              finalName.paper_details +
              "\nPress # to go back!👈"
          );
          [ca4, ca1, ca2] = cases(case4, case2, case1);
          break;
        case "5":
          message.reply(bonafide);
          message.reply(finalName.bonafidemsg + "\nPress # to go back!👈");
          break;

        case "6":
          message.reply(
            "Click on below link and fill the details\n\n" +
              "https://yourownresume.netlify.app/" +
              "\nPress # to go back!👈"
          );
          break;

        case "7":
          message.reply(
            "For comprehensive understanding https://www.de.gtu.ac.in/StudyMaterial_Presentation\n\n" +
              finalName.egd_material +
              "\nPress # to go back!👈"
          );
          break;

        case "8":
          message.reply(finalName.query + "\nPress # to go back!👈");
          break;

        case "9":
          message.reply(finalName.quit);
          flag = false;
          break;

        case "CE":
          let ceDetails = await fetchCourseDetails("CE");
          message.reply(ceDetails);
          break;

        case "IT":
          let itDetails = await fetchCourseDetails("IT");
          message.reply(itDetails);
          break;

        case "ICT":
          let ictDetails = await fetchCourseDetails("ICT");
          message.reply(ictDetails);
          break;

        case "ME":
          let meDetails = await fetchCourseDetails("ME");
          message.reply(meDetails);
          break;

        case "CL":
          let clDetails = await fetchCourseDetails("CL");
          message.reply(clDetails);
          break;

        case "#":
          message.reply(finalName.initial_msg);
          ca1 = ca2 = ca4 = false;
          break;

        case "hi" || "HI" || "HII" || "hii" || "Hello":
          break;

        case "CE-P":
          let cePapers = await fetchCourseDetails("CE", true);
          message.reply("Please wait while we are fetching the information...");
          setTimeout(() => {
            message.reply(cePapers);
          }, 3000);
          break;

        case "ME-P":
          let mePapers = await fetchCourseDetails("ME", true);
          message.reply("Please wait while we are fetching the information...");
          setTimeout(() => {
            message.reply(mePapers);
          }, 3000);
          break;

        case "CL-P":
          let clPapers = await fetchCourseDetails("CL", true);
          message.reply("Please wait while we are fetching the information...");
          setTimeout(() => {
            message.reply(clPapers);
          }, 3000);
          break;

        // case "CEM-P":
        //   message.reply("Please wait while we are fetching the information...");
        //   setTimeout(() => {
        //     message.reply(finalName.ce_papers + "\nPress # to go back!👈");
        //   }, 3000);
        //   break;

        case "IT-P":
          let itPapers = await fetchCourseDetails("IT", true);
          message.reply("Please wait while we are fetching the information...");
          setTimeout(() => {
            message.reply(itPapers);
          }, 3000);
          break;

        case "ICT-P":
          let ictPapers = await fetchCourseDetails("ICT", true);
          message.reply("Please wait while we are fetching the information...");
          setTimeout(() => {
            message.reply(ictPapers);
          }, 3000);
          break;

        default:
          // console.log(ca1, ca2, ca4);
          if (ca1) {
            message.reply(
              "*Invalid input*" +
                "\n\nPlease reply with 2 character course code\nFor ex: *CE* " +
                "\n\nPress # to go back!👈"
            );
          } else if (ca2) {
            message.reply(
              "*Invalid input!!*\n\nPlease enter your enrollment number again." +
                "\n\nPress # to go back!👈"
            );
          } else if (ca4) {
            message.reply(
              "*Invalid input!!* " +
                "\n\nSelect your branch\n\n" +
                finalName.paper_details +
                "\nPress # to go back!👈"
            );
          } else {
            message.reply(`*Uh oh! Invalid input*\n\n` + finalName.initial_msg);
          }
      }
    } else {
      message.reply(`Uh oh! Invalid input\n\nPlease enter Hi/Hello to begin!`);
    }
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});
