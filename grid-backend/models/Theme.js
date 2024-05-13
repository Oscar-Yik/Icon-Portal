// models/Theme.js

const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  block: {
    type: String,
    required: true
  },
  header: {
    type: String,
    required: true
  },
  headerButton: {
    type: String,
    required: true
  },
  headerFont: {
    type: String,
    required: true
  },
  grid: {
    type: String,
    required: true
  },
  editBox: {
    type: String,
    required: true
  },
  editBoxFont: {
    type: String,
    required: true
  },
  backImg: {
    type: String,
    required: true
  }
});

module.exports = Theme = mongoose.model('theme', ThemeSchema);