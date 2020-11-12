const mongoose = require("mongoose");

const admin = new mongoose.Schema({
    email:{type:String},
    department:{type:String},
    start_day: {type:String},
    final_day: {type:String},
    hours: [{
        start_time: {type: String},
        end_time: {type: String}
    }],
    staff: [{
        id: {type: String},
        name: {type: String},
        email: {type: String},
    }],
    sub: [{
            year: {type: String},
            subjectCode: {type: String},
            subjectName: {type: String},
            slot1: {type: String},
            slot2: {type: String},
    }]
});


module.exports=Admin=mongoose.model("admin",admin);