// models/Theme.js

import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  block: { type: String, required: true },
  header: { type: String, required: true },
  headerButton: { type: String, required: true },
  headerFont: { type: String, required: true },
  grid: { type: String, required: true },
  editBox: { type: String, required: true },
  editBoxFont: { type: String, required: true },
  backImg: { type: String, required: true }
});

export default mongoose.model('theme', ThemeSchema);