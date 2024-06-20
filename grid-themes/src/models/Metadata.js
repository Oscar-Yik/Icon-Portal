// models/Metadata.js

const mongoose = require('mongoose');

const MetadataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Number, required: true }
});

module.exports = Metadata = mongoose.model('metadata', MetadataSchema);