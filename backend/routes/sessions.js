const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { auth } = require('../middleware/auth');

// Create a session
router.post('/', auth, async (req, res) => {
  const { sport, teamNames, additionalPlayersRequired, date, venue } = req.body;
  try {
    const session = new Session({
      sport, createdBy: req.user._id, teamNames, additionalPlayersRequired, date, venue, players: [req.user._id]
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Join a session
router.post('/:id/join', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status === 'cancelled') return res.status(400).json({ message: 'Session cancelled' });
    if (new Date(session.date) < new Date()) return res.status(400).json({ message: 'Cannot join past session' });
    if (session.players.includes(req.user._id)) return res.status(400).json({ message: 'Already joined' });
    session.players.push(req.user._id);
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel a session (creator only)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (!session.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    session.status = 'cancelled';
    session.cancelReason = reason;
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List sessions created by user or all active sessions
router.get('/', auth, async (req, res) => {
  const { mine, joined } = req.query;
  try {
    let sessions;
    if (mine === 'true') {
      sessions = await Session.find({ createdBy: req.user._id }).populate('sport players', 'name');
    } else if (joined === 'true') {
      sessions = await Session.find({ players: req.user._id }).populate('sport players', 'name');
    } else {
      sessions = await Session.find({ status: 'active' }).populate('sport players', 'name');
    }
    res.json(sessions);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
