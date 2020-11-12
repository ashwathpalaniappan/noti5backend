const mongoose = require("mongoose");

const superadmin = new mongoose.Schema({
    college:{type:String},
    admins: [{
        department: {type: String,},
        admin: {type: String,}
    }]
});


module.exports=Superadmin=mongoose.model("superadmin",superadmin);