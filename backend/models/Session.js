const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  additionalPlayersRequired: { type: Number, default: 0 },
  teamNames: [{ type: String }],
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  cancelReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
