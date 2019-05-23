const mongoose = require('mongoose');
const moment = require('moment');

const getPatients = userId => [
  {
    firstName: 'first1',
    lastName: 'last1',
    lastTreatment: moment(),
    createdBy: userId
  },
  {
    firstName: 'first2',
    lastName: 'last2',
    lastTreatment: moment().add(1, 'days'), // the last treatment
    createdBy: userId
  },
  {
    firstName: 'first3',
    lastName: 'last3',
    lastTreatment: moment(),
    createdBy: userId
  },
  {
    firstName: 'first4',
    lastName: 'last4',
    createdBy: mongoose.Types.ObjectId()
  }
];

const getPatient = (userId = '') =>
  userId ? getPatients(userId)[0] : getPatients(userId)[3];

module.exports = { getPatients, getPatient };
