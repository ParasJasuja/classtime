const express = require("express");
const mongoose = require("mongoose");
const url = require("url");
const cors = require("cors");
const dotenv = require("dotenv");

const port = process.env.PORT;
if(port == null || port ==""){
  port = 9000;
}
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k4w7t.mongodb.net/classtimeDB`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    feedback: String
  });
  const timetableCatSchema = new mongoose.Schema(
    {
      class: String,
      sems: [Number]
    }
  );
  const timetableSchema = new mongoose.Schema(
      {
          class: String,
          sem: Number,
          session: [{
            starttime: String,
            endtime: String,
            code: String,
            Lname: String,
            Tname: String,
            url: String,
            group: [Number],
            date: String
        }],
          timetable: {
                  monday:[{
                      starttime: String,
                      endtime: String,
                      code: String,
                      Lname: String,
                      Tname: String,
                      url: String,
                      group: [Number]
                  }
                ],
                  tuesday:[{
                    starttime: String,
                    endtime: String,
                    code: String,
                    Lname: String,
                    Tname: String,
                    url: String,
                    group: [Number]
                }],
                  wednesday:[{
                    starttime: String,
                    endtime: String,
                    code: String,
                    Lname: String,
                    Tname: String,
                    url: String,
                    group: [Number]
                }],
                  thursday:[{
                    starttime: String,
                    endtime: String,
                    code: String,
                    Lname: String,
                    Tname: String,
                    url: String,
                    group: [Number]
                }],
                  friday:[{
                    starttime: String,
                    endtime: String,
                    code: String,
                    Lname: String,
                    Tname: String,
                    url: String,
                    group: [Number]
                }]
              }
      }
  );
  const timetable = mongoose.model("timetable", timetableSchema);
  const feedback = mongoose.model("feedback", feedbackSchema);
  const timetableCat = mongoose.model("timetableCat", timetableCatSchema);

  app.get("/",(req,res)=>{
    res.send("This is an api")
  })

    app.get("/timetables",(req,res)=>{
      const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      if(req.query.class){
        let selectClass = req.query.class;
        let semester = Number(req.query.semester);
        let group = Number(req.query.group);
        let d = new Date().getTime();
        let date = new Date();
        date.setTime(d+19800000);
        let currentLecture = null;
        const day = days[date.getDay()];
        const currentTime = `${date.getUTCHours()}:${("0" + date.getUTCMinutes()).slice(-2)}:${("0" + date.getUTCSeconds()).slice(-2)}`;

        const hour = Number(date.getHours()) ;
        timetable.find({class: selectClass, sem: semester},(err, data)=>{
          if(err){
            res.send(err);
            console.log("err");
          }else{
            if(data.length > 0){
              if(day!= "saturday" && day!="sunday"){
                // check for session available and set current lecture accordingly
                if(data[0].session.length !== 0){
                  for (let i = 0 ; i<data[0].session.length ; i++){
                    let lec = data[0].session[i];
                    if(lec.endtime <= currentTime){
                      timetable.updateOne({class: selectClass, sem: semester}, { $pull : { session: { _id : lec._id } } }, {multi:true});
                    }
                    if(lec.starttime <= currentTime && lec.endtime >= currentTime && Number(lec.date) === Number(date.getDate()) ){
                      if(lec.group.includes(group)){
                        currentLecture = lec;
                      }
                    }
                    if(lec.endtime <= currentTime){
                      data[0].session.splice(i,1);
                    }
                  }
                }
                // filter data for groups and set current lec if not already set
                const newData = data[0].timetable[day].filter((lec)=>{
                  var x;
                    for (x in lec.group){
                      if(lec.group[x] == group ){
                        if(lec.starttime <= currentTime && lec.endtime >= currentTime && !currentLecture ){
                          console.log(lec.starttime);
                          currentLecture = lec;
                        }
                        if(lec.starttime > currentTime ){
                          return true;
                        }
                      }
                    }
                    return false;
                  });
                res.send({
                  upcomingLectures: newData,
                  currentLecture: currentLecture
                });
                upcomingLectures = null;
              }else{
                res.send({
                  upcomingLectures: null,
                  currentLecture: null
                })
              }
            }else{
              res.send({
                upcomingLectures: null,
                currentLecture: null
              })
            }
          }
        });
      }
    });
    app.get("/timetables/getcategory", (req,res)=>{
      timetableCat.find({},(err, data)=>{
        if(err){
          console.log(err);
        }else{
          res.send(data);
        }
      })
    })

    app.get("/timetables/all",(req,res)=>{
      if(req.query.class){
        const days = ['monday','tuesday','wednesday','thursday','friday'];
        let selectClass = req.query.class;
        let semester = Number(req.query.semester);
        let x;
        let g;
        let allLectures = [];
        timetable.find({class: selectClass, sem: semester},(err, data)=>{
          if(err){
            res.send(err);
          }else{
            if( data.length !== 0 && req.query.group){
              let group = req.query.group;
              let newTimetable = {};
              let x;
              days.forEach((x)=>{
                let g;
                let newData = data[0].timetable[x].filter((lec)=>{
                  if(lec.group.includes(group)){
                    return true;
                  }
                  return false;
                });
                newTimetable[x] = newData;
              });
              res.send(newTimetable);              
            }else {
              if(data.length !== 0){
              res.send(data[0]);
              }else{
                res.send({
                  _id: false,
                  class: false})
              }
            }
          }
        });
      }
    });

    app.post("/admin/edit/timetables/addsession", (req,res)=>{
      const stream = req.body.stream
      const lec = req.body.lec;
      const date = new Date().getDate();
      lec.date = date;
      timetable.findOneAndUpdate({class: stream.class, sem: Number(stream.sem)}, { $push: { session: lec }}, (err, data)=>{
        if(err){
          console.log(err);
          res.send({
            err: err,
            response: null
          });
        }else{
          res.send({
            err: null,
            response: "Updated Successfully"
          });
        }
      } );
      
    });

    app.get("/more/feedback", (req,res)=>{
      feedback.find({}, (err,data)=>{
        if(err){
          res.send(err);
        }else{
          res.send(data);
        }
      });
    });

    app.post("/more/feedback", (req,res)=>{
      const fb = new feedback(req.body);
      fb.save((err)=>{
        if(err){
          ok: false
        }else{
          res.send({
            ok: true,
            response: "Added Your feedback"
          });
        }
      });
    });

    app.post("/admin/login", (req,res)=>{
      const password = 1234;
      const userpass = req.body.pass;
      if(Number(userpass) === password ){
        res.send({
          response: true
        });
      }else{
        res.send({
          response: false
        });
      }
    });

    app.post("/admin/edit/timetables",(req,res)=>{
      const data = req.body;
      const newClass = new timetable(data);
      timetableCat.updateOne({class: data.class}, {  $addToSet: {sems: data.sem, $sort:1 }}, {upsert: true},(err)=>{
        if(err){
          console.log(err);
        }else{
          console.log("added");
        }
      } );
      timetable.updateOne({class: data.class, sem: data.sem},data, {upsert: true} , (err)=>{
        if(err){
          console.log(err);
          res.send({err: err,
            res: null
          });
        }else{
          res.send({err: null,
            response: "Added Successfully"
          });
        }
      });
    })

});


app.listen(port , ()=>{
    console.log(`listening to port: ${port}`);
});