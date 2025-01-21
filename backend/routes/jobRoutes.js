const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const User = require('../models/user');
const { protect } = require('../middlewares/authMiddleware');

// Route for posting a job
router.post('/create', protect, async (req, res) => {
  const { title, description, budget } = req.body;
  const userId = req.user.id;

  try {
    // Validate user role
    const user = await User.findById(userId);
    if (!user || (user.role !== 'client' && user.role !== 'both')) {
      return res.status(403).json({ error: 'You are not authorized to post jobs.' });
    }

    // Create a new job
    const job = new Job({
      title,
      description,
      budget,
      client: userId,
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully.', job });
  } catch (error) {
    res.status(500).json({ error: 'Error creating job.' });
  }
});

// Route for applying to a job
router.post('/apply/:jobId', protect, async (req, res) => {
  const jobId = req.params.jobId;
  const freelancerId = req.user.id;

  try {
    // Validate user role
    const user = await User.findById(freelancerId);
    if (!user || (user.role !== 'freelancer' && user.role !== 'both')) {
      return res.status(403).json({ error: 'You are not authorized to apply for jobs.' });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Check if the freelancer has already applied
    if (job.freelancers.includes(freelancerId)) {
      return res.status(400).json({ error: 'You have already applied for this job.' });
    }

    // Add freelancer to the job's freelancers list
    job.freelancers.push(freelancerId);
    await job.save();

    res.status(200).json({ message: 'Application submitted successfully.', job });
  } catch (error) {
    res.status(500).json({ error: 'Error applying to job.' });
  }
});

module.exports = router;
