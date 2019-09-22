const router = require('express').Router();
const Patient = require('../models/Patient');
const moment = require('moment');

// Get all patients
router.get('/', async (req, res) => {
  const patients = await Patient.find({ createdBy: req.user._id }).sort({
    lastTreatment: 'desc'
  });
  res.status(200).send(patients);
});

// Add new patient
router.post('/', async (req, res) => {
  // Simple validation
  if (!req.body.firstName || !req.body.lastName)
    return res.status(400).send({ msg: 'שם פרטי ושם משפחה הם שדות חובה' });

  if (req.body.birthday)
    req.body.birthday = moment.utc(req.body.birthday, 'DD/MM/YYYY'); // TODO: validate date

  const newPatient = await Patient.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).send(newPatient);
});

// Edit patient
router.put('/', async (req, res) => {
  const patient = req.body;

  // Simple validation
  if (!patient.firstName || !patient.lastName)
    return res.status(400).send({ msg: 'שם פרטי ושם משפחה הם שדות חובה' });

  if (req.body.birthday)
    req.body.birthday = moment.utc(req.body.birthday, 'DD/MM/YYYY');

  const oldPatient = await Patient.findById(patient._id);
  oldPatient.set({ ...patient });
  const editedPatient = await oldPatient.save();

  res.status(200).send(editedPatient);
});

module.exports = router;
