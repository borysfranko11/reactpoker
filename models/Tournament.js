const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TournamentSchema = new Schema({
  tourid: {
    type: Number,
    required: true
  },
  players: {
    type: Number,
    default: 0,
    required: true
  },
  name: {
    type: String, 
    required: true
  },
  buyin: {
    type: Number,
    default: 100,
    required: true
  },
  status: {
    type: String,
    default: ''
  }

});

module.exports = Tournament = mongoose.model('tour', TournamentSchema);
