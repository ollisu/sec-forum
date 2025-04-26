const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    createdBy: {
        type: String,
        required: true,
        immutable: true,
    },
    createdAt:{
        type: Date,
        required: true,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt:{
      type: Date,
      required: true,
      default: () => Date.now()
    },
    latestMessageUpdate: {
        type: Date,
        default: () => Date.now()
    },
    messages: [{
        content: String,
        postedBy: {
            type: String,
            ref: 'User',
            immutable: true
        },
        postedAt:{
            type: Date,
            default: () => Date.now(),
            immutable: true
        },
        updatedAt:{
            type: Date,
            default: () => Date.now(),
        }
    }]
});

TopicSchema.pre('save', function(next) {
    // First update the updatedAt timestamp on the topic
    this.updatedAt = Date.now();

    // Check if any messages are modified to update latestMessageUpdate
    let latestMessageUpdate = this.latestMessageUpdate;

    this.messages.forEach(message => {
        // Ensure that message has content modified, and update its timestamp
        if (message.isModified('content')) {
            message.updatedAt = Date.now();
            latestMessageUpdate = message.updatedAt;
        }
    });

    // Finally update latestMessageUpdate field on the topic
    this.latestMessageUpdate = latestMessageUpdate;

    next();
});


module.exports = mongoose.model('Topic', TopicSchema)