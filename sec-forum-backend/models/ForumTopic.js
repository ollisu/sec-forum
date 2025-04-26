const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    createdBy: {
        type: Date,
        required: true,
        immutable: true,
        default: () =>  Date.now(),
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

// Middleware to refresh updatedAt when changes happen to the topic itself.
TopicSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
})

// Record when the latest message changes happen in the topic.
TopicSchema.pre('save', function(next){
    let latestMessageUpdate = this.latestMessageUpdate;

    this.messages.forEach(message => {
        if (message.isModified('content')){
            message.updatedAt = Date.now();
            latestMessageUpdate = message.updatedAt;
        }

        this.latestMessageUpdate = latestMessageUpdate;
        next();
    })
})


module.exports = mongoose.model('Topic', TopicSchema)