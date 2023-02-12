const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const courseSchema = new mongoose.Schema({
    branch : String,
    desc : String,
    companies :Array,
    colleges : Array,
    papers : Array 
});

const courseModel = mongoose.model("course", courseSchema)
module.exports = courseModel;