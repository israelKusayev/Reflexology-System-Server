const mongoose = require('mongoose');

const getTreatments = userId => [
  { visitReason: 'abcd', patientId: userId, treatmentNumber: 1 },
  { visitReason: 'efgh', patientId: userId, treatmentNumber: 2 },
  {
    visitReason: 'igkl',
    patientId: mongoose.Types.ObjectId(),
    treatmentNumber: 3
  }
];

const getTreatment = userId => getTreatments(userId)[0];

module.exports = { getTreatments, getTreatment };
