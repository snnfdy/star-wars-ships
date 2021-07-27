const express = require("express");
const app = express();
const mongoose = require("mongoose");

const fighterRoutes = require("./fighters");

mongoose.connect("mongodb+srv://star-wars-fighters:"+ process.env.MONGO_ATLAS_PW +"@star-wars-fighters.1t4ku.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
)

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/fighters", fighterRoutes); 

app.use((req,res,next)=>{
  const error= new Error("Not Found");
  error.status(404);
  next(error);
})

app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  })
})
  
module.exports = app;

