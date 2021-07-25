const express = require("express");
const router = express.Router();
const mongoose = require ("mongoose");

const Fighter = require("./fighter")

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

router.post("/", (req,res,next)=>{
    const fighter = new Fighter({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age,
        sex: req.body.sex,
        email: req.body.email
    });
    fighter
        .save()
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message:"Handling POST requests to /fighters",
                createdFighter: result
            });
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


module.exports = router;