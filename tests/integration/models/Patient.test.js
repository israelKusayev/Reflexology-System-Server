const Patient = require('../../../models/Patient');
const { getPatient } = require('../../mockData/patients.js');
const winston = require('winston');
require('dotenv').config();
require('../../../startup/db.js')();

winston.info = args => {};
winston.error = args => {};

describe('Patient model', () => {
  it('should update the last treatment if last treatment does not exists', async () => {
    const date = new Date();

    let newPatinet = new Patient(getPatient());
    await newPatinet.save();

    await newPatinet.updateLastTreatment(date);

    const patient = await Patient.findById(newPatinet._id);
    expect(patient.lastTreatment).toEqual(date);
  });
});
