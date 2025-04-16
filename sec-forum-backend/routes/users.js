var express = require('express');
var router = express.Router();
var User = require('../models/User'); // Import the User model.

/* GET users listing. */

router.get('/', async function(req, res, next) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
