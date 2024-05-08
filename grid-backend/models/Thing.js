// models/Thing.js

const mongoose = require('mongoose');

const ThingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  url: {
    type: String, 
    required: true
  }
});

module.exports = Thing = mongoose.model('thing', ThingSchema);