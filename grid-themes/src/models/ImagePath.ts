// models/ImagePath.js

import mongoose from 'mongoose';

const ImagePathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img_path: { type: String, required: true }
});

export default mongoose.model('imagePath', ImagePathSchema);