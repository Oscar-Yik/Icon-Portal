// models/Unit.js

const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  key: { type: String, required: true }, 
  value: { type: String, required: true }
});

module.exports = Unit = mongoose.model('unit', UnitSchema);