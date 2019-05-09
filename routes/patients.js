const router = require('express').Router();
const Patient = require('../models/Patient');

// Get all patients
router.get('/', async (req, res) => {
  const patients = await Patient.find().sort({ createdAt: 'desc' });
  res.status(200).send(patients);
});

// Add new patient
router.post('/', async (req, res) => {
  const newPatient = await Patient.create(req.body);
  res.status(201).send(newPatient);
});

// Edit patient
router.put('/', async (req, res) => {
  const patient = req.body;
  const editedPatient = await Patient.findByIdAndUpdate(patient._id, patient, {
    new: true
  });
  res.status(200).send(editedPatient);
});

module.exports = router;
