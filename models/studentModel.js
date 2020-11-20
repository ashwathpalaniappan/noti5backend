const mongoose = require("mongoose");

const student = new mongoose.Schema({
    email:{type:String}
});


module.exports=Student=mongoose.model("student",student);