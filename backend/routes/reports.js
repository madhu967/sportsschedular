const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Sport = require('../models/Sport');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/sessions', auth, adminOnly, async (req, res) => {
  const { period } = req.query; // daily, weekly, monthly
  let startDate = new Date();
  if (period === 'daily') startDate.setDate(startDate.getDate() - 1);
  else if (period === 'weekly') startDate.setDate(startDate.getDate() - 7);
  else if (period === 'monthly') startDate.setMonth(startDate.getMonth() - 1);
  else startDate = new Date(0);

  const count = await Session.countDocuments({ createdAt: { $gte: startDate } });
  res.json({ period, sessionsPlayed: count });
});

router.get('/sports/popularity', auth, adminOnly, async (req, res) => {
  const aggregate = await Session.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$sport', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const populated = await Sport.populate(aggregate, { path: '_id' });
  res.json(populated.map(item => ({ sport: item._id.name, sessions: item.count })));
});

module.exports = router;
