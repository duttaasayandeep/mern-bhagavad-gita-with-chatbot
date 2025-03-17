// backend/models/Content.js
const mongoose = require('mongoose');

const BenefitsVideoSchema = new mongoose.Schema(
  {
    youtubeUrl: { type: String, required: true },
    problemTitle: { type: String, required: true },
    solutionDescription: { type: String, required: true },
    bgImage: { type: String }, // NEW FIELD: Background image URL/path
  },
  { _id: true }
);

const ContentSchema = new mongoose.Schema({
  home: {
    youtubeUrl: { type: String },
    description: { type: String },
  },
  benefits: {
    videos: [BenefitsVideoSchema],
  },
});

module.exports = mongoose.model('Content', ContentSchema);
