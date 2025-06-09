const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'employer'], default: 'candidate' },
  resume: {
    skills: [{ type: String }],
    education: [{
      degree: String,
      institution: String,
      year: Number,
    }],
    experience: [{
      company: String,
      role: String,
      years: Number,
    }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

candidateSchema.index({ 'resume.skills': 'text', email: 1 });

module.exports = mongoose.model('Candidate', candidateSchema);
