const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  salary: { type: Number, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

jobSchema.index({ title: 'text', requirements: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
