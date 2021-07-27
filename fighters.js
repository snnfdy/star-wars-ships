const axios = require ('axios');
const express = require("express");
const router = express.Router();
const mongoose = require ("mongoose");

const Fighter = require("./fighter")

let shipNumbers = [2,3,5,9,10,11,12,13,15,17,21,22,23,27,28,29,31,32,39,40,41,43,47,48,49,52,58,59,61,63];
let shipLength=shipNumbers.length;
let max = shipLength-1;
let min=0;

let url = "https://swapi.dev/api/starships/"

let options = {json: true};


router.post("/", async (req,res,next)=>{
        let fighter = new Fighter({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            age: req.body.age,
            sex: req.body.sex,
            email: req.body.email
        });

        let number = shipNumbers[Math.floor(Math.random() * (max - min + 1)) + min];
        
        //axios.get(url+number)
                
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
    }
);

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

router.patch("/:fighterId", (req,res,next)=>{
    const id = req.params.fighterId;
    Fighter.findByIdAndUpdate(id, req.body).then(()=>{
        Fighter.findOne(id).then((fighter)=>{
            res.send(fighter);
        })
        
        })
    })
router.delete("/:fighterId", (req,res,next)=>{
    const id = req.params.fighterId;
    Fighter.remove({_id:id})
        .exec()
        .then(res=>{
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports=router;