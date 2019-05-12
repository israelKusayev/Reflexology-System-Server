const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Create Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  register_date: { type: Date, default: Date.now() }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, name: this.name },
    process.env.JWT_SECRET_KEY
  );
};

module.exports = User = mongoose.model('user', userSchema);
