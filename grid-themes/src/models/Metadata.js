// models/Metadata.js

import mongoose from 'mongoose';

const MetadataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Number, required: true }
});

export default mongoose.model('metadata', MetadataSchema);