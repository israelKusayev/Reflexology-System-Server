const mongoose = require('mongoose');
const Treatment = require('./Treatment');
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

patientSchema.methods.updateLastTreatment = async function(date) {
  console.log('a');

  if (!this.lastTreatment) {
    console.log('b');

    this.lastTreatment = date;
  } else {
    const lastTreatment = await Treatment.findOne(
      { patientId: this._id },
      'date',
      {
        sort: {
          date: -1 //Sort by Date Added DESC
        }
      }
    );

    this.lastTreatment = lastTreatment.date;
  }
  return this.save();
};

module.exports = Patient = mongoose.model('patient', patientSchema);
