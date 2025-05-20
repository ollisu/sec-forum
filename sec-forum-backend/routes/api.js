var express = require("express");
var router = express.Router();
var Topic = require("../models/ForumTopic");
var User = require("../models/User");
const mongoose = require('mongoose');
const ForumTopic = require("../models/ForumTopic");
const { verifyToken, requireType } = require("../middlewares/auth");

router.get('/topic', verifyToken, async function(req, res, next) {
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
      error.status = 400;
      return next(error);
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

  router.post('/topic', async function(req, res, next) {
    try {
        const { title, userId } = req.body;

        // Check if title and userId are provided
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

            // Check if the provided ID is a valid ObjectId format
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          const error = new Error('Invalid ID format');
          error.status = 400;
          return next(error);
        }

        // Optional: Check if the user exists in the database
        const userExists = await User.findById({ _id: userId });
        if (!userExists) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Create a new Topic
        const newTopic = new Topic({
            title,
            createdBy: userId,
        });

        // Save the new topic to the database
        const savedTopic = await newTopic.save();

        // Return the saved topic in the response with status 201 (Created)
        res.status(201).json(savedTopic);
    } catch (err) {
        console.error('Error saving topic:', err);
        next(err);
    }
});

router.post('/topic/message', async function(req, res, next) {
  try {
      const { content, userId, username, topicId } = req.body;
      console.log("username at backend", username);

      // Check if title and userId are provided
      if (!content) {
          return res.status(400).json({ error: 'Message cannot be empty!' });
      }

      if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error('Invalid ID format');
        error.status = 400;
        return next(error);
      }

      // Optional: Check if the user exists in the database
      const userExists = await User.findById({ _id: userId });
      if (!userExists) {
          return res.status(400).json({ error: 'User not found' });
      }

      // Check if  valid topicId is provided
      if (!mongoose.Types.ObjectId.isValid(topicId)) {
        const error = new Error('Invalid ID format for a topic!');
        error.status = 400;
        return next(error);
      }
      // Check if the provided ID is a valid ObjectId format
      // Find the topic by ID and check if it exists
      const topic = await ForumTopic.findById({ _id: topicId });
      if (!topic) {
        return res.status(400).json({ error: 'Topic not found!' });
      }
      
      // Create a new message object
      // and push it to the topic's messages array.
      const newMessage = {
        content: content,
        postedBy: userId,
        postedByName: username,
      }

      topic.messages.push(newMessage);
      await topic.save();

      // Return the saved topic in the response with status 201 (Created)
      res.status(201).json(newMessage);
  } catch (err) {
      console.error('Error saving topic:', err);
      next(err);
  }
});


module.exports = router;