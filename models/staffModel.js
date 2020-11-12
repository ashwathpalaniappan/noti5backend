const mongoose = require("mongoose");

const staff = new mongoose.Schema({
    email:{type:String},
    department:{type:String},
    admin: {type:String},
    defaults: [{
        subject: {type:String},
        link: {type:String}
    }],
    hour0: {type:String},
    hour1: {type:String},
    hour2: {type:String},
    hour3: {type:String}
});


module.exports=Staff=mongoose.model("staff",staff);