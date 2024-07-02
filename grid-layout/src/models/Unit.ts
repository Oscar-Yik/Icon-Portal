// models/Unit.js

import mongoose from 'mongoose';

const UnitSchema = new mongoose.Schema({
  key: { type: String, required: true }, 
  value: { type: String, required: true }
});

export default mongoose.model('unit', UnitSchema);