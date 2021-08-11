const jwt = require ("jsonwebtoken");

const config = process.env;

const verifyToken = (req,res,next) =>{
    const token=
    req.body.token||req.query.token||req.header["x-access-token"];

    if(!token){
        return res.status(403).send("Token needs to be given for authentication")
    }
    try{
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        req.user=decoded
    }catch(err){
        return res.status(400).send("invalid token");
    }
    return next();
};

module.exports = verifyToken;