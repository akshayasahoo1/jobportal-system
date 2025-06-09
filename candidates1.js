const express = require('express');
const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Update Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.user.id,
      { $set: { resume: req.body.resume, updatedAt: Date.now() } },
      { new: true }
    );
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error });
  }
});

// Search Candidates (for employers)
router.get('/search', authMiddleware, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Access denied' });
  const { q } = req.query;
  const query = q ? { $text: { $search: q } } : {};
  try {
    const candidates = await Candidate.find(query)
      .select('name resume')
      .limit(10);
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error searching candidates', error });
  }
});

module.exports = router;
