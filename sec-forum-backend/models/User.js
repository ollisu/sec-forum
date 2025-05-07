const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const PEPPER = process.env.PEPPER;
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
username:{
    type:String,
    required:true,
    unique:true
},
firstname:{
    type:String,
    required:true,
},
lastname:{
    type:String,
    required:true,
},
  email:{
      type:String,
      required:true,
      unique:true
  },
  password:{
      type:String,
      required:true
  },
  type:{
    type: String,
    required: true,
    default: 'user'
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
  refreshTokens: {
    type: [String],
     default: []
    },
  }
);

UserSchema.pre('save', async function(next) {
    const user = this;
    try {
        if (user.isModified()) {
            user.updatedAt = Date.now();
          }
      
          if(user.isModified('password')){
              // Generate salt
              salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      
              // Hash the pw.
              const hash = await bcrypt.hash(user.password + PEPPER, salt);
      
              // Override the pw with hashed pw.
              user.password = hash;
          }
      
        next();
    } catch (err) {
        next(err);
    }
  });

// Remove fields that should not be returned for the user in reponses.
UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      // Change id key and change type to string.
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.password
    }
  })
  

module.exports = mongoose.model('User', UserSchema)