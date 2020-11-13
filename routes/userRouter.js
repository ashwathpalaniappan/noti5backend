const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/userModel");
const Staff = require("../models/staffModel");
const Timetable = require("../models/TimetableModel");
const SuperAdmin = require("../models/superAdminModel");


router.post("/adminSignup", async(req,res) => {
    try{
    const {email,department} = req.body

    const existingUser = await Admin.findOne({email:email});
    if(existingUser)
        return res.json(existingUser);
    
    const newAdmin = new Admin({
        email:email,
        department: department
    });

    const saved = await newAdmin.save();
    res.json(saved);


    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/adminLogin",async(req,res)=>
{
    try{
        const {email,password} = req.body;
        if(!email || !password)
            return res.status(400).json({msg: "Fill all the fields"});
        
        const admin = await Admin.findOne({email:email});
        if(!admin)
            return res.status(400).json({msg:"Not registered"});

        const isMatch =  await bcrypt.compare(password,admin.password);
        if(!isMatch)
            return res.status(400).json({msg:"Incorrect password"});

        const token = jwt.sign({id:admin._id},process.env.JWT_TOKEN);
        res.json({
            token,
            admin:{
                id:admin._id,
                college:admin.college,
                email:admin.email
            }
        });
    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/addStaff",async(req,res)=>
{
    try{
        const {email,staff} = req.body;
        if(!staff)
            return res.status(400).json({msg: "Proper file is not selected"});
        
        const admin = await Admin.findOne({email:email});
        admin.staff = staff;
        admin.save();
        res.json(admin);
    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/addSub",async(req,res)=>
{
    try{
        const {email,subjects} = req.body;        
        const admin = await Admin.findOne({email:email});
        admin.sub = subjects;
        admin.save();
        res.json(admin);
    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/addTime",async(req,res)=>
{
    try{
        const {email,start_day,final_day,hours} = req.body;        
        const admin = await Admin.findOne({email:email});
        admin.start_day = start_day;
        admin.final_day = final_day;
        admin.hours = hours;
        admin.save();
        res.json(admin);
    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/retTime",async(req,res)=>
{
    try{
        const {email} = req.body;        
        const admin = await Admin.findOne({email:email});
        res.json({
            start_day: admin.start_day,
            final_day: admin.final_day,
            hours: admin.hours,
            numberofhours: admin.hours.length
        });
    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/retSubjects",async(req,res)=>
{
    try{
        const {email,dept_name,year,slot} = req.body;        
        const admin = await Admin.findOne({email:email});
      var ans = admin.sub;
      var i,j,ans2=[],staff=[],staff2=[];
      for(i=0;i<ans.length;i++)
      {
          if(ans[i].year === year)
          {
              let x = ans[i].subjectName + "(" + ans[i].subjectCode + ")"
              ans2.push(x);
              if(slot==="slot1")
                {
                    staff.push(ans[i].slot1);
                    for(j=0;j<admin.staff.length;j++)
                    {
                        if(ans[i].slot1===admin.staff[j].email && !staff2.includes(admin.staff[j].name))
                        staff2.push(admin.staff[j].name);
                    }
                }
              else if(slot==="slot2")
                {
                    staff.push(ans[i].slot2);
                    for(j=0;j<admin.staff.length;j++)
                    {
                        if(ans[i].slot1===admin.staff[j].email && !staff2.includes(admin.staff[j].name))
                        staff2.push(admin.staff[j].name);
                    }
                }
          }
      }
      res.json({subj: ans2,teach: staff,staffArr: staff2});
    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/retDept",async(req,res)=>
{
    try{      
        const {email} = req.body;  
        const admin = await SuperAdmin.findOne({college:"Thiagarajar College of Engineering"});
        var i,arr=[],arr2=[];
        for(i=0;i<admin.admins.length;i++)
        {
            arr.push(admin.admins[i].department);
            arr2.push(admin.admins[i].admin);
        }
        res.json({dept: arr,admins: arr2});
    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/setTimetable", async(req,res) => {
    try{
    const {department,year,slot,start_day,final_day,hours,sub,timetable} = req.body
    const existingUser = await Timetable.findOne({department:department, year:year, slot:slot});
    if(existingUser)
       {
        existingUser.timetable = timetable;
        await existingUser.save();
        return res.json(existingUser);
       } 
    
    const newTimetable = new Timetable({
        department:department,
        year:year,
        slot:slot,
        start_day: start_day,
        final_day: final_day,
        leaveStart_day: "",
        leaveFinal_day: "",
        hours: hours,
        sub: sub,
        timetable: timetable
    });

    const saved = await newTimetable.save();
    res.json(saved);

    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/staffTimetable", async(req,res) => {
    try{
    const {department,email} = req.body
    var docs = await Timetable.find({department:department});
    if(!docs)
    return res.status(400).json({msg: "You don't have any timetable"});
    var a,i,j,k;
    var mon=[], tue=[], wed=[], thurs=[], fri=[], sat=[], sun=[];
    var n = docs[0].hours.length;
    for(a=0;a<n;a++)
    {
        mon.push({day:"Monday",sub:"",teach:"",topic:"",link:"",bool:""});
        tue.push({day:"Tuesday",sub:"",teach:"",topic:"",link:"",bool:""});
        wed.push({day:"Wednesday",sub:"",teach:"",topic:"",link:"",bool:""});
        thurs.push({day:"Thursday",sub:"",teach:"",topic:"",link:"",bool:""});
        fri.push({day:"Friday",sub:"",teach:"",topic:"",link:"",bool:""});
        sat.push({day:"Saturday",sub:"",teach:"",topic:"",link:"",bool:""});
        sun.push({day:"Sunday",sub:"",teach:"",topic:"",link:"",bool:""});
    }
    var st,fi;
    if(docs[0].timetable[0].leaveStart_day)
    {st = docs[0].timetable[0].leaveStart_day;
    fi = docs[0].timetable[0].leaveFinalday;}
    else{
    st="";fi=""
    }
    for(i=0;i<docs.length;i++)
    {
        for(j=0;j<docs[i].timetable.length;j++)
        {
            for(k=0;k<docs[i].timetable[j].periods.length;k++)
            {
                if(docs[i].timetable[j].periods[k].teach===email)
                {
                    if(docs[i].timetable[j].day==="Monday")
                    {
                        mon[k].sub = docs[i].timetable[j].periods[k].sub;
                        mon[k].year = docs[i].year;
                        mon[k].slot = docs[i].slot;
                    }
                    else if(docs[i].timetable[j].day==="Tuesday")
                    {
                        tue[k].sub = docs[i].timetable[j].periods[k].sub;
                        tue[k].year = docs[i].year;
                        tue[k].slot = docs[i].slot;
                    }
                    else if(docs[i].timetable[j].day==="Wednesday")
                    {
                        wed[k].sub = docs[i].timetable[j].periods[k].sub;
                        wed[k].year = docs[i].year;
                        wed[k].slot = docs[i].slot;
                    }
                    else if(docs[i].timetable[j].day==="Thursday")
                    {
                        thurs[k].sub = docs[i].timetable[j].periods[k].sub;
                        thurs[k].year = docs[i].year;
                        thurs[k].slot = docs[i].slot;
                    }
                    else if(docs[i].timetable[j].day==="Friday")
                    {
                        fri[k].sub = docs[i].timetable[j].periods[k].sub;
                        fri[k].year = docs[i].year;
                        fri[k].slot = docs[i].slot;
                    }
                    else if(docs[i].timetable[j].day==="Saturday")
                    {
                        sat[k].sub = docs[i].timetable[j].periods[k].sub;
                        sat[k].year = docs[i].year;
                        sat[k].slot = docs[i].slot;
                    }
                    else if(docs[i].timetable[j].day==="Sunday")
                    {
                        sun[k].sub = docs[i].timetable[j].periods[k].sub;
                        sun[k].year = docs[i].year;
                        sun[k].slot = docs[i].slot;
                    }
                }
            }
        }
    }
    var res1 = [];
    res1.push(mon);
    res1.push(tue);
    res1.push(wed);
    res1.push(thurs);
    res1.push(fri);
    res1.push(sat);
    res1.push(sun);

    var ar=[];
    var existingUser2 = await Staff.findOne({email:email});

    if(existingUser2.hour0)
    ar.push(existingUser2.hour0);
    else
    ar.push("");

    if(existingUser2.hour1)
    ar.push(existingUser2.hour1);
    else
    ar.push("");

    if(existingUser2.hour2)
    ar.push(existingUser2.hour2);
    else
    ar.push("");

    if(existingUser2.hour3)
    ar.push(existingUser2.hour3);
    else
    ar.push("");


    res.json({tb: res1,hasSet: ar,leaveStart_day: st,leaveFinal_day: fi});

    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/staffSignup", async(req,res) => {
    try{
    const {department,email} = req.body

    const admin = await SuperAdmin.findOne({college:"Thiagarajar College of Engineering"});
    var i,dept_admin,bool=0;
    for(i=0;i<admin.admins.length;i++)
    {
        if(admin.admins[i].department===department)
        dept_admin = admin.admins[i].admin;
    }
    
    const deptAdminUser = await Admin.findOne({email:dept_admin});
    for(i=0;i<deptAdminUser.staff.length;i++)
    {
        if(deptAdminUser.staff[i].email===email)
        bool=1;
    }

    if(bool===0)
    return res.status(400).json({msg: "Your admin has not included you! DM you admin for queries!"});

    const existingUser = await Staff.findOne({email:email});
    if(existingUser)
        {existingUser.admin = dept_admin;
        await existingUser.save();
        return res.json(existingUser);}
    var arr=[];
    for(i=0;i<deptAdminUser.hours.length;i++)
    {
        arr.push("")
    }
    const newStaff = new Staff({
        email:email,
        department: department,
        admin: dept_admin,
        defaults: []
    });

    const saved = await newStaff.save();
    res.json(saved);

    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/staffSub", async(req,res) => {
    try{
    const {department,email} = req.body
    var docs = await Timetable.find({department:department});
    if(!docs)
    return res.status(400).json({msg: "You don't have any timetable"});
    var i,j,k;
    var arr=[];
    for(i=0;i<docs.length;i++)
    {
        for(j=0;j<docs[i].timetable.length;j++)
        {
            for(k=0;k<docs[i].timetable[j].periods.length;k++)
            {
                if(docs[i].timetable[j].periods[k].teach===email)
                {
                    if(!arr.includes(docs[i].timetable[j].periods[k].sub))
                    {
                    arr.push(docs[i].timetable[j].periods[k].sub);
                    }
                }
            }
        }
    }

    var arr1 = [];
    const existingUser = await Staff.findOne({email:email});
    if(existingUser.defaults.length===0 || !existingUser.defaults || existingUser.defaults===null)
    {
        let m;
        for(m=0;m<arr.length;m++)
        {
            arr1.push("");
        }
    }
    else{
        let m;
        for(m=0;m<arr.length;m++)
        {
            arr1.push(existingUser.defaults[m].link);
        } 
    }

    res.json({sub:arr,link:arr1});

    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/setDefault", async(req,res) => {
    try{
    const {email,subLink,department} = req.body
    const existingUser = await Staff.findOne({email:email});
    existingUser.defaults = subLink;
    const sad = await existingUser.save();

    const docs = await Timetable.find({department:department});
    
    var i,j,k,l;
    for(l=0;l<subLink.length;l++)
    {    
        for(i=0;i<docs.length;i++)
        {
            for(j=0;j<docs[i].timetable.length;j++)
            {
                for(k=0;k<docs[i].timetable[j].periods.length;k++)
                {
                    if(docs[i].timetable[j].periods[k].teach===email && docs[i].timetable[j].periods[k].sub===subLink[l].subject)
                        {
                            docs[i].timetable[j].periods[k].def = subLink[l].link;
                        }
                }
            }
            await docs[i].save();
        }
    }

    res.json(docs);

    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/getDefault", async(req,res) => {
    try{
    const {email,subject} = req.body
    const existingUser = await Staff.findOne({email:email});
    const i = existingUser.defaults.map(function(e) { return e.subject; }).indexOf(subject);
    res.json(existingUser.defaults[i].link);
    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/addInfo", async(req,res) => {
    try{
    const {email,department,year,slot,day,hour,sub,topic,link,date,bool} = req.body
    var docs = await Timetable.findOne({department:department,year:year,slot:slot});
    if(!docs)
    return res.status(400).json({msg: "You don't have any timetable"});
    var j;
        for(j=0;j<docs.timetable.length;j++)
        {
            if(docs.timetable[j].day===day)
            {
               if(docs.timetable[j].periods[hour].sub===sub && docs.timetable[j].periods[hour].teach===email)
               {
                docs.timetable[j].periods[hour].topic = topic;  
                docs.timetable[j].periods[hour].link = link; 
                docs.timetable[j].periods[hour].date = date; 
                docs.timetable[j].periods[hour].bool = bool; 
               }
            }
        }
    await docs.save();

    var existingUser = await Staff.findOne({email:email});
    if(hour===0)
    existingUser.hour0 = date;
    else if(hour===1)
    existingUser.hour1 = date;
    else if(hour===2)
    existingUser.hour2 = date;
    else if(hour===3)
    existingUser.hour3 = date;
    const asd = await existingUser.save();
    res.json(asd);

    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/studentTimetable", async(req,res) => {
    try{
    const {department, year, slot} = req.body
    var docs = await Timetable.findOne({department:department,year:year,slot:slot});
    if(!docs)
    return res.status(400).json({msg: "Your admin has not uploaded any timetable! Please DM them!"});
    res.json(docs);

    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/shiftTimetableDay", async(req,res) => {
    try{
    const {department,days} = req.body
    var docs = await Timetable.find({department:department});
    var docs2 = docs;
    if(!docs)
    return res.status(400).json({msg: "You don't have any timetable"});
    var i,j,k,arr=[];
    for(i=0;i<docs[0].timetable.length;i++)
    {
        arr.push(docs[0].timetable[i].day);
    }
    var d = new Date();
    var str = d.toString().split(" ");
    var s = str[0]+str[1]+str[2];

    var d2 = new Date(d.getFullYear(),d.getMonth(),d.getDate()+Number(days));
    var str1 = d2.toString().split(" ");
    var s1 = str1[0]+str1[1]+str1[2];

    for(i=0;i<docs.length;i++)
    {
        docs[i].leaveStart_day = s;
        docs[i].leaveFinal_day = s1;
        docs[i].timetable = (docs[i].timetable.slice(docs[i].timetable.length - Number(days), docs[i].timetable.length)).concat(docs[i].timetable.slice(0, docs[i].timetable.length - Number(days)));
        for(j=0;j<docs[i].timetable.length;j++)
        {
                docs2[i].timetable[j].day = arr[j];
        }
        await docs[i].save();
    }
    res.json({tb:docs});

    } catch (err){
        res.status(500).json({error:err.message});
    }
});

router.post("/shiftTimetableDate", async(req,res) => {
    try{
    const {department,leaveStart_day,leaveFinal_day} = req.body;
    var docs = await Timetable.find({department:department});
    if(!docs)
    return res.status(400).json({msg: "You don't have any timetable"});
    var i,arr=[];
    for(i=0;i<docs[0].timetable.length;i++)
    {
        arr.push(docs[0].timetable[i].day);
    }
    for(i=0;i<docs.length;i++)
    {
        docs[i].leaveStart_day = leaveStart_day;
        docs[i].leaveFinal_day = leaveFinal_day;
        await docs[i].save();
    }
    res.json({tb:docs});

    } catch (err){
        res.status(500).json({error:err.message});
    }
});


module.exports = router;