// models/Conversion.js
const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  xmlContent: {
    type: String,
    required: true
  },
  pageCount: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conversion', ConversionSchema);