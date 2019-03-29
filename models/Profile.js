const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  gold: {
    type: Number, 
    default: 1000
  },
  cashier: {
    type: Number,
    default: 0
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
