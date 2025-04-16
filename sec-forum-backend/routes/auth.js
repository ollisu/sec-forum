require('dotenv').config();
var express = require("express");
var router = express.Router();
var User = require("../models/User");
const bcrypt = require('bcrypt');

// ROUTE 1:
router.post("/signup", async (req, res) => {
  try {
    let user = await User.create({
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
    });
    res.json({ user });
    
  } catch (err) {
    if(err.code === 11000)
      {return res.status(400).json({ error: "Username or email already exists" });
  } 
    res.status(500).json({ error: "An error occurred while creating the user" });

  }

});

// ROUTE 2:
router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username});
    if(!user){
      return res.status(400).json({error: 'Unable to log in with given username!'})
    }
    
    const correctPassword = await bcrypt.compare(req.body.password + process.env.PEPPER, user.password);

    if(!correctPassword) return res.status(400).json({error: 'Invalid password!'})

    res.json({ user });
    
  } catch (err) {

    res.status(500).json({ error: "An error occurred while login in the user" });

  }

});

module.exports = router;