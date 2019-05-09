const mongoose = require('mongoose');

// Create Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  register_date: { type: Date, default: Date.now() }
});

module.exports = User = mongoose.model('user', userSchema);
