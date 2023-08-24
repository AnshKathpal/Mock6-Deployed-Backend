const jwt = require("jsonwebtoken");
const blacklist = require("../blacklist")

require("dotenv").config();

const middleware = (req,res,next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(blacklist.includes(token)){
            res.status(200).json({msg : "Please login!"} )
        }
        if(!token){
            res.status(401).json({err : "Token not Provided"})
        }

        const decoded = jwt.verify(token,process.env.secretCode)
        console.log(decoded, "decoded");

        req.userId = decoded.userID;
        req.username = decoded.username;

        console.log(req.userId,req.username , "check")

        if(!decoded){
            res.status(400).json({ err: "You are not authenticated"})
        }
        next();

    } catch (error) {
        console.log(error.message);
        res.end(error.message)
    }

}

module.exports = middleware