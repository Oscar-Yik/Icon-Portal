// models/ImagePath.js

const mongoose = require('mongoose');

const ImagePathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img_path: { type: String, required: true }
});

module.exports = ImagePath = mongoose.model('imagePath', ImagePathSchema);