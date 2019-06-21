const mongoose = require('mongoose');
const Treatment = require('./Treatment');
// Create Schema
const patientSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  momName: { type: String, trim: true },
  age: { type: String, trim: true },
  lastAgeUpdate: { type: Date },
  phone: { type: String, trim: true },
  email: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  lastTreatment: { type: Date },
  lastTreatmentCall: { type: Boolean },
  lastTreatmentCallDate: { type: Date }
});

patientSchema.pre('save', function() {
  if (this.modifiedPaths().some(m => m === 'age')) {
    this.lastAgeUpdate = Date();
  }

  if (this.modifiedPaths().some(m => m === 'lastTreatmentCall')) {
    if (this.lastTreatmentCall === true) this.lastTreatmentCallDate = Date();
    else this.lastTreatmentCallDate = null;
  }
});

patientSchema.methods.updateLastTreatment = async function(date) {
  if (!this.lastTreatment) {
    this.lastTreatment = date;
  } else {
    const lastTreatment = await Treatment.findOne({ patientId: this._id }, 'date', {
      sort: {
        date: -1 //Sort by Date Added DESC
      }
    });

    this.lastTreatment = lastTreatment.date;
  }
  return this.save();
};

patientSchema.methods.resetLastCall = async function() {
  this.lastTreatmentCall = false;
  this.lastTreatmentCallDate = null;
  return this.save();
};

module.exports = Patient = mongoose.model('patient', patientSchema);
