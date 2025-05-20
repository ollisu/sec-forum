var express = require('express');
var router = express.Router();
var User = require('../models/User'); // Import the User model.
const { verifyToken, requireType } = require("../middlewares/auth");
/* GET users listing. */

router.get('/',verifyToken,requireType("admin"), async function(req, res, next) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
