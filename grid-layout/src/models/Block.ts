// models/Block.js

import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema({
  data_grid: {
    i: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
    isBounded: { type: Boolean, required: true },
    isResizable: { type: Boolean, required: true }
  },
  link: { type: String, required: true },
  img_url: { type: String, required: true }
});

export default mongoose.model('block', BlockSchema);