const express = require('express');
const Job = require('../models/Job');

const router = express.Router();

router.get('/jobs-per-industry', async (req, res) => {
  try {
    const result = await Job.aggregate([
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error });
  }
});

module.exports = router;
