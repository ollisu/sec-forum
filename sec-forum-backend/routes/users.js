var express = require('express');
var router = express.Router();
var { client } = require('../db'); // Import the MongoDB client.
/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const db = client.db(process.env.DATABASE_NAME)
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    
    res.json(users);
    
  } catch (err) {
    next(err);    
  }
});

module.exports = router;
