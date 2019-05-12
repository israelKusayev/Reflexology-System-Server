const mongoose = require('mongoose');

// Create Schema
const patientSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  momName: { type: String, trim: true },
  age: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  lastTreatment: { type: Date }
});

module.exports = Patient = mongoose.model('patient', patientSchema);
