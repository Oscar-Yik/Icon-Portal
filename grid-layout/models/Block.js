// models/Block.js

const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  data_grid: {
    i: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
    isBounded: { type: Boolean, required: true }
  },
  link: { type: String, required: true },
  img_url: { type: String, required: true }
});

module.exports = Block = mongoose.model('block', BlockSchema);