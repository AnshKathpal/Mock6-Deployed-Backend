const jwt = require("jsonwebtoken");
const blacklist = require("../blacklist")

require("dotenv").config();


const middleware=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if(token){
        if(blacklist.includes(token)){
            res.json({msg:"Login again the token is expired"})
        }
        try{
            jwt.verify(token,process.env.secretCode,(err,decoded)=>{
                if(decoded){
                    next()
                }
                else{
                    res.status(200).json({msg:'Token is not valide'})
                }
            })
        }
        catch(err){
            res.status(400).json({error:err.message})
        }
    }
    else{
        res.json({msg:'Token needs to be require may be you have to login again'})
    }
}

module.exports={
    middleware
}