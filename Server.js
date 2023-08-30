const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose");
const nodemailer=require('nodemailer');
require("dotenv").config();



const server=express()
server.use(express.json()) 
server.use(express.urlencoded())
server.use(cors())

mongoose.connect("mongodb://10.45.27.236:27017/Myauth",{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=> {
    console.log("Db connected")
})

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const slotSchema=new mongoose.Schema({
    name:String,
    email:String,
    day:String,
    slottime:String
})
const DateSchema=new mongoose.Schema({
    day:String,
    slots:Array
})
const otpScheme=new mongoose.Schema({
    otp:String,
    email:String,
})
const User=new mongoose.model("users",userSchema);
const slotu=new mongoose.model("slots",slotSchema);
const dates=new mongoose.model("Dates",DateSchema);
const otpdata=new mongoose.model("otpdata",otpScheme);
//Routes

server.post("/login",(req,res)=>{
    const  {email , password}=req.body;
    User.findOne({email:email},(err,user)=>{
        if(user) {
          if(password===user.password) {
            res.send({message : "Log in successFull",user:user});
          }
          else {
            res.send({message:"Incorrect Password"});
          }
        }
        else {
            res.send({message:"User not Found"})
        }
    })
})

server.post("/signup",(req,res)=>{
    //let testAcc=await nodemailer.createTestAccount();
   const  {name , email, password,otp}=req.body;
   otpdata.findOne({email:email},(err,user)=> {
    if(user.otp!==otp) {
       res.send("Invalid OTP");
    }
    else {
        const user=new User({
            name,
            email,
            password
        })
        user.save(err=>{
            if(err) {
                res.send(err);
            }
            else {
                res.send({message : "SuccessFully Registered"});
            }
        })
    }})
 })

//  server.post("/validateOTP",async(req,res)=>{
//    const {otp ,name , email,password}=req.body;
//    otpdata.findOne(({email:email}),(err,user)=>{
//      if(user.otp===otp) {
//         const user=new User({
//             name,
//             email,
//             password
//         })
//         user.save(err=>{
//             if(err) {
//                 res.send(err);
//             }
//             else {
//                 res.send({message : "SuccessFully Registered"});
//             }
//         })
//      }
//      else {
//         res.send("Invalid OTP");
//      }
//    })
//  })
 server.post("/makeslot",(req,res)=>{
    //let testAcc=await nodemailer.createTestAccount();
   const  {name , email ,day, slottime}=req.body;
   slotu.findOne({email:email},(err,user)=> {
    if(user) {
        res.send({message:"Slot Already Booked From You"})
    }
    else {
        const user=new slotu({
            name,
            email,
            day,
            slottime
        })
        const slots=slottime;
        dates.findOne({day:day},(err,fday)=>{
            if(fday) {
                fday.slots.push(slots);
                fday.save();
            }
            else {
                const user1=new dates({
                    day,
                    slots
                })
                user1.save(err=>{
                    if(err) {
                        //res.send(err);
                    }
                    else {
                        //res.send({message : "SuccessFully Allocated"});
                    }
                })
            }
        })
        user.save(err=>{
            if(err) {
                res.send(err);
            }
            else {
                res.send({message : "SuccessFully Booked"});
            }
        })
     }
    })
 })

 server.post("/makeday",async(req,res)=>{
    //let testAcc=await nodemailer.createTestAccount();
   const  {day, slots}=req.body;
   dates.findOne({day:day},(err,user)=> {
    if(user) {
        user.slots.push(slots);
        user.save();
        res.send({message:"Successfully Appended",updated:user.slots});
    }
    else {
        const user=new dates({
            day,
            slots
        })
        user.save(err=>{
            if(err) {
                res.send(err);
            }
            else {
                res.send({message : "SuccessFully Allocated"});
            }
        })
     }
    })
 })

server.get("/getmyslot/:email",(req,res)=>{
    const {email}=req.params;
    //console.log(email);
    slotu.find(({email:email}),function(err,user){
        if(user) {
            res.send(user);
        }
        else {
            res.send(err);
        }
    });
    // slotu.find(({}),function(err,user){
    //     res.send(user);
    // })
})

server.delete("/deletemyslot/:email",async(req,res)=>{
    const {email}=req.params;
    // slotu.findOne(({email:email}),(err,user)=>{
    //     res.send(user);
    // });
    slotu.findOne(({email:email}),(err,user)=>{
        dates.findOne(({day:user.day}),(err,user1)=>{
            const arrayWithoutD = user1.slots.filter(function (letter) {
                return letter !== user.slottime;
            });
            user1.slots=arrayWithoutD;
            user1.save();       
        })
    })
    slotu.deleteOne(({email:email}),(err,user)=>{
        res.send(user);
    });
}) 

server.get("/getday/:day",async(req,res)=>{
    const {day}=req.params;
    dates.findOne({day:day},(err,user)=>{
        if(user) {
            res.send(user.slots);
        }
        else {
            res.send(err);
        }
    })
})


 
 server.post("/makemail",async(req, res) => {
    const {email}=req.body;
    User.findOne({email:email},(err,user)=> {
        if(user) {
            res.send("Email Already Registered");
        }
        else {
        try{
        const otp=Math.floor(100000 + Math.random()*900000);
        const transport=nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com',
            port:'587',
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            secureConnection: 'true',
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });
        let matter= 'Here is your otp to Sign up  ' + otp + '  Please Dont Share with Anyone , Thank You';
        const mailOptions ={
         from:process.env.EMAIL,
         to :email,
         subject:"EMAIL FOR VERIFICATION",
         html:matter
        }
        otpdata.findOne(({email:email}),(err,user)=>{
           if(user) {
             user.otp=otp;
             user.save();
           }
           else {
            const newuser= new otpdata({
                email,
                otp
            })
            newuser.save();
           }
        })
        transport.sendMail(mailOptions,(err,info)=>{
         if(err) {
            res.send("Error in sending Mail");
         }
         else {
            //console.log("Email sent " + info.response);
            res.send("OTP SENT Succesfully");
         }
        })
     }catch(err) {
       res.send(err);
     }
    }
})
})


server.listen(27017,() =>{
    console.log("Started at port 27017");
})
