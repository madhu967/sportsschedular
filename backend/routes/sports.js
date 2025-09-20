const express = require('express');
const router = express.Router();
const Sport = require('../models/Sport');
const { auth, adminOnly } = require('../middleware/auth');

// Create sport (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const sport = new Sport({ name: req.body.name });
    await sport.save();
    res.status(201).json(sport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit sport (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!sport) return res.status(404).json({ message: 'Sport not found' });
    res.json(sport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List sports (all authenticated users)
router.get('/', auth, async (req, res) => {
  const sports = await Sport.find();
  res.json(sports);
});

module.exports = router;
