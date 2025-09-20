const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('Sport', sportSchema);
