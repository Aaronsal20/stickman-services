const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user');
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    console.log("neter", req.body);
    const password = await bcrypt.hash(req.body.password, 10);
    const url = req.protocol + '://' + req.get("host");
    console.log("exports.register -> req.protocol", req.protocol)
    const uId = mongoose.Types.ObjectId();
    
    console.log("exports.createUser -> uId", uId)
    const user = new userSchema({
      _id: uId,
      nickName: req.body.name,
      password: password,
      email: req.body.email,
      image: url + "/images/" + req.file.filename,
    });
    const result = await user.save();
    console.log("exports.createUser -> result", result)
  
    res.status(201).json({
      message: 'User created',
      result: result
    });
}

exports.signIn = async (req, res, next) => {
    console.log("exports.signIn ->  process.env.JWT_KEY", req.body.email)
    let fetchedUser;
    userSchema.findOne({email: req.body.email })
    .then(user => {
    console.log("exports.signIn -> user", user)
      fetchedUser = user;
      if(!user) {
        console.log("exports.signIn -")
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      return bcrypt.compare(req.body.password, user.password)
    }).then(result => {
    console.log("exports.signIn -> result", result)
      if (!result) {
        console.log("expo.signIn -")
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},"secret_this_should_be_longer",
      { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userImage: fetchedUser.image
      })
    }).catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    })
  }

