const express = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');

const router = express.Router();

// Middleware to verify JWT
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

// Create Job
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Access denied' });
  try {
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job', error });
  }
});

// Search Jobs
router.get('/search', async (req, res) => {
  const { q, location, minSalary, maxSalary } = req.query;
  const query = {};
  if (q) query.$text = { $search: q };
  if (location) query.location = { $regex: location, $options: 'i' };
  if (minSalary || maxSalary) query.salary = {};
  if (minSalary) query.salary.$gte = Number(minSalary);
  if (maxSalary) query.salary.$lte = Number(maxSalary);

  try {
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error searching jobs', error });
  }
});

// Update Job
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user.id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, { $set: { ...req.body, updatedAt: Date.now() } }, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error updating job', error });
  }
});

// Delete Job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user.id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    await Job.findByIdAndUpdate(req.params.id, { $set: { isActive: false } });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting job', error });
  }
});

module.exports = router;
