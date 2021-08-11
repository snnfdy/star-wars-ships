const axios = require ('axios');
const express = require("express");
const router = express.Router();
const mongoose = require ("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let Fighter = require("./fighter")
const auth = require("./auth")

let shipNumbers = [2,3,5,9,10,11,12,13,15,17,21,22,23,27,28,29,31,32,39,40,41,43,47,48,49,52,58,59,61,63];
let shipLength=shipNumbers.length;
let max = shipLength-1;
let min=0;
//console.log(Fighter)

let url = "https://swapi.dev/api/starships/"

let options = {json: true};

router.post("/register", async (req,res)=>{
    try{
        const { first_name,last_name, age,sex,email,password} =req.body;

        if(!(first_name&&last_name&&age&&sex&&email&&password)){
            return res.status(400).send("All Input Fields Should Be Filled")
        }

        let oldFighter = await Fighter.findOne({email});

        

        if (oldFighter){
            return res.status(409).send ("Fighter Exists Already, Please Login")
        }

        encryptedPassword = await bcrypt.hash(password,10)

        const fighter = await Fighter.create({
            first_name,
            last_name,
            age,
            sex,
            email: email.toLowerCase(),
            password: encryptedPassword
        })

        let number = shipNumbers[Math.floor(Math.random() * (max - min + 1)) + min];
        
        axios.get(url+number)
                
        let ship = await axios.get(url+number,options);

        if(!ship) return res.status(400).json({message: "could not fetch ship",status: false})

            if(ship){
                console.log(ship.data)
                fighter.ship = ship.data.name;
                fighter.url = url+number;
                let Save = await fighter.save()

                if(Save)return res.status(201).json({message:"Saving successful",createdFighter: fighter,status: true});

                if(!Save) return res.status(400).json({message: "Saving failed",status: false});
            }
         
        const token = jwt.sign({fighter_id:fighter._id, email}, process.env.TOKEN_KEY, {expiresIn: "2h"})
            fighter.token = token
            res.status(201).json(fighter)




    }catch(err){
        console.log(err)
    }
})


router.post("/login", async (req,res)=>{
    try{
        const {email,password}=req.body;
        if (!(email&&password)){
            res.status(400).send("All Input Fields Should Be Filled")
        }
        const fighter = await Fighter.findOne({email});
        if (fighter&&(await bcrypt.compare(password,fighter.password))){
            const token = jwt.sign(
                {fighter_id:fighter._id,email},
                "" + process.env.TOKEN_KEY,
                {
                    expiresIn:"2h"
                }
            );
            fighter.token = token;
            res.status(200).json(fighter);
        }res.status(400).send("Invalid Credentials")

    }catch(err){
        console.log(err)
    }
});



router.get("/", (req,res,next)=>{
    Fighter.find()
        .exec()
        .then(docs=>{
            console.log(docs);
            res.status(200).json(docs)   
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get("/:fighterId", (req,res,next)=>{
    const id = req.params.fighterId;
    Fighter.findById(id)
    .exec()
    .then(doc=>{
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({doc});
        } else{
            res.status(404).json({message: "No valid entry found for provided ID"});
        }
        
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: err});
    });
});

router.put("/:fighterId", (req,res,next)=>{
    const id = req.params.fighterId;
    Fighter.findByIdAndUpdate(id, req.body)
        .then(function(fighter){
            res.send(fighter);
        })
    })

router.delete("/:fighterId", (req,res,next)=>{
    const id = req.params.fighterId;
    Fighter.findByIdAndRemove(id)
        .then(function(fighter){
            res.send(fighter);
        });
});

module.exports=router;
