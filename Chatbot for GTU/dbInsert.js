const studentModel = require("./studData");
console.log(studentModel);

arr = [{
    "enrollment": 190320107135,
    "name" : "Amit",
    "contact": "919909848666@c.us",
    "semFeeStatus": false,
    "branch": "CE",
    "backlog" : true,
    "result": "https://drive.google.com/file/d/10RjnSlc2vBozjkal4OEDMlwDJOJILCMV/view?usp=sharing",
    "examFeeStatus": true,
    "sem": 7
}, {
    "enrollment": 190320107140,
    "name" : "Shubham", 
    "contact": "919687205427@c.us",
    "semFeeStatus": true,
    "branch": "CH",
    "backlog" : false,
    "result": "https://drive.google.com/file/d/10Oo5nHCMSFiPbYcbVZeOn-uM8zo2f3Yi/view?usp=sharing",
    "examFeeStatus": false,
    "sem": 4
}, {
    "enrollment": 190320107145,
    "name" : "Vihar",
    "contact": "919409148598@c.us",
    "semFeeStatus": false,
    "branch": "ME",
    "backlog" : true,
    "result": "https://drive.google.com/file/d/10NqALKLZXlom-WxT2xC0hWHi_epwePze/view?usp=sharing",
    "examFeeStatus": false,
    "sem": 3
}, {
    "enrollment": 190320107150,
    "name" : "Kaushal",
    "contact": "919773450547@c.us",
    "semFeeStatus": true,
    "branch": "CL",
    "backlog" : false,
    "result": "https://drive.google.com/file/d/10M3Iw_atgnrq-iie7d8MmptAbN4t2gUL/view?usp=sharing",
    "examFeeStatus": false,
    "sem": 2
}, {
    "enrollment": 190320107120,
    "name" : "Harsh",
    "contact": "917359413156@c.us",
    "semFeeStatus": false,
    "branch": "ME",
    "backlog" : true,
    "result": "https://drive.google.com/file/d/10Jo93Z8OrQLNcz48Ak3oYp2je9ghz2d8/view?usp=sharing",
    "examFeeStatus": false,
    "sem": 1
}]

arr.forEach(element => {
    insertStud(element);
});

async function insertStud(obj) {
    const { enrollment, name, contact, semFeeStatus, branch, backlog, result, examFeeStatus, sem } = obj
    let u1 = new studentModel({ enrollment, name, contact, semFeeStatus, branch, backlog, result, examFeeStatus, sem });
    await u1.save();
    console.log(u1);
}