var express = require("express");
var router = express.Router();
var User = require("../models/User");

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
module.exports = router;