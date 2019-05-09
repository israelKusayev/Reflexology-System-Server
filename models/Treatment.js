const mongoose = require('mongoose');

// Create Schema
const treatmentSchema = new mongoose.Schema({
  date: { type: Date, default: new Date().toISOString().split('T')[0] },
  visitReason: { type: String, trim: true },
  treatmentNumber: { type: Number, required: true },
  referredBy: { type: String, trim: true },
  findings: { type: String, trim: true },
  recommendations: { type: String, trim: true },
  remarks: { type: String, trim: true },
  patientId: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = Treatment = mongoose.model('treatment', treatmentSchema);
