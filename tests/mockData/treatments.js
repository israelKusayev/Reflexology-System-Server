const mongoose = require('mongoose');

const getTreatments = patientId => [
  { visitReason: 'abcd', patientId, treatmentNumber: 1 },
  { visitReason: 'efgh', patientId, treatmentNumber: 2 },
  {
    visitReason: 'igkl',
    patientId: mongoose.Types.ObjectId(),
    treatmentNumber: 3
  }
];

const getTreatment = patientId => getTreatments(patientId)[0];

module.exports = { getTreatments, getTreatment };
