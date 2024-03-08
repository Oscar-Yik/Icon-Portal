// models/Block.js

const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  i: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  w: {
    type: Number,
    required: true
  },
  h: {
    type: Number,
    required: true
  },
  isBounded: {
    type: Boolean,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = Block = mongoose.model('block', BlockSchema);