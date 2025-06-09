const express = require('express');
const jwt = require('jsonwebtoken');
const Application = require('../models/Application');

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

// Apply for Job
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ message: 'Access denied' });
  try {
    const application = new Application({
      jobId: req.body.jobId,
      candidateId: req.user.id,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: 'Error applying for job', error });
  }
});

// View Applications (for employers)
router.get('/job/:jobId', authMiddleware, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Access denied' });
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('candidateId', 'name resume');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
});

module.exports = router;
