var express = require("express");
var router = express.Router();
var Topic = require("../models/ForumTopic");
const mongoose = require('mongoose');

router.get('/topic', async function(req, res, next) {
  try {
    const topics = await Topic.find({});
    res.json(topics);
  } catch (err) {
    next(err);
  }
});

// GET single topic by ID → /topic/:id
router.get('/topic/:id', async function(req, res, next) {
    const { id } = req.params;

    // Check if the provided ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid ID format');
      error.status = 400; // Bad Request
      return next(error); // Pass the error to the error handler
  }

    try {
      const topic = await Topic.findById(id);
      if (!topic) {
        const error = new Error('Topic not found');
        error.status = 404;
        throw error;
      }
      res.json(topic);
    } catch (err) {
      next(err);
    }
  });

module.exports = router;