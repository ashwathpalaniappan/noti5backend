const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { sendEmail } = require('./mail');

const app = express();
app.use(express.json());
app.use(cors());



app.post("/sendMail",(req,res)=>{
    sendEmail(req.body.email,req.body.name,req.body.code1);
    res.json("Sent");
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));



mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},
(err) => {
    if(err) throw err;
    console.log("Mongodb connection estabilshed");
}
);

app.use("/", require("./routes/userRouter"));






//mongodb+srv://notification:5QhNlFByc02ttpVA@notification.9je7f.mongodb.net/notify?retryWrites=true&w=majority
//adsfjhgsfhjsdbgfjbasjfhb