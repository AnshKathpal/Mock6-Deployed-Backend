const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRoute = express.Router()

userRoute.post("/register", async (req, res) => {
  const { username, avatar, email, password } = req.body;

  try {
    const user = await User.userModel.findOne({ email });
    if (user) {
      res.status(400).json({ err: "User Already Exists, Please Login!!" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          res.status(400).json({ err: err.message });
        } else {
          const user = new User.userModel({
            username,
            avatar,
            email,
            password: hash,
          });
          await user.save();
          res.status(200).json({ msg: "User Registered" });
        }
      });
    }
  } catch (error) {
    res.status(400).end({ error: error.message });
  }
});

userRoute.post("/login", async(req,res) => {

    const {email,password} = req.body;

    try {

        const user = await User.userModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err,result) => {
                if(result){
                    let token = jwt.sign({
                        userID : user._id
                    },
                    process.env.secretCode, {expiresIn : "4d"})
                    res.status(200).json({msg : "Login Successful", token})
                }else{
                    res.status(400).json({err : "Wron Creds."})
                }
            })
        }
        else{
            res.status(400).json({err : "User Doesn't exists. Please SignUp"})
        }
        
    } catch (error) {
        
        res.status(400).end({error : error.message})

    }

})


module.exports = {
    userRoute
}
