const Patient = require('../../../models/Patient');
const Treatment = require('../../../models/Treatment');
const { getPatient } = require('../../mockData/patients');
const { getTreatment } = require('../../mockData/treatments');
const winston = require('winston');
require('dotenv').config();
require('../../../startup/db.js')();

winston.info = args => {};
winston.error = args => {};
let date;
let fiveDaysAgo;
beforeEach(() => {
  date = new Date();

  fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
});
afterEach(() => {
  Patient.deleteMany({});
  Treatment.deleteMany({});
});

describe('Patient model', () => {
  it('should update the last treatment if last treatment does not exists', async () => {
    let newPatinet = new Patient(getPatient());
    await newPatinet.save();

    await newPatinet.updateLastTreatment(date);

    const patient = await Patient.findById(newPatinet._id);
    expect(patient.lastTreatment).toEqual(date);
  });

  let newPatinet;
  beforeEach(async () => {
    newPatinet = new Patient(getPatient());
    newPatinet.lastTreatment = fiveDaysAgo;
    await newPatinet.save();
  });

  it('should update the last treatment to the new date (new date is the latest)', async () => {
    let treatment1 = new Treatment(getTreatment(newPatinet._id));
    treatment1.date = fiveDaysAgo;
    await treatment1.save();

    let treatment2 = new Treatment(getTreatment(newPatinet._id));
    treatment2.date = date;
    await treatment2.save();

    await newPatinet.updateLastTreatment(date);

    const patient = await Patient.findById(newPatinet._id);
    expect(patient.lastTreatment).toEqual(date);
  });

  it('should keep the last treatment (new date is the older)', async () => {
    date.setDate(date.getDate() - 7);

    let treatment1 = new Treatment(getTreatment(newPatinet._id));
    treatment1.date = fiveDaysAgo;
    await treatment1.save();

    let treatment2 = new Treatment(getTreatment(newPatinet._id));
    treatment2.date = date;
    await treatment2.save();

    await newPatinet.updateLastTreatment(date);

    const patient = await Patient.findById(newPatinet._id);
    expect(patient.lastTreatment).toEqual(fiveDaysAgo);
  });
});
