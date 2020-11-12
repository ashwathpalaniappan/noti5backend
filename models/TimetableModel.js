const mongoose = require("mongoose");

const timetable = new mongoose.Schema({
    department:{type:String},
    year:{type:String},
    slot:{type:String},
    start_day: {type:String},
    final_day: {type:String},
    hours: [{
        start_time: {type: String},
        end_time: {type: String}
    }],
    sub: [{type: String}],
    leaveStart_day: {type: String},
    leaveFinal_day: {type: String},
    timetable: [{
        day: {type: String},
        periods: [{
            sub: {type: String},
            teach: {type: String},
            topic: {type: String},
            link: {type: String},
            bool: {type: String},
            date: {type: String},
            def: {type: String},
            teach_name: {type: String}
        }]
    }]
});


module.exports=Timetable=mongoose.model("timetable",timetable);