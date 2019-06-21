const router = require('express').Router();
const Treatment = require('../models/Treatment');
const Patient = require('../models/Patient');

// Get all treatments
router.get('/', async (req, res) => {
  const treatments = await Treatment.find();
  res.status(200).send(treatments);
});

// Get all treatments according to patient id
router.get('/:patientId', async (req, res) => {
  const { patientId } = req.params;

  const treatments = await Treatment.find({ patientId }).sort({ _id: 'desc' });

  res.status(200).send(treatments);
});

// Add new treatment
router.post('/', async (req, res) => {
  const { patientId, date } = req.body;

  // Simple validation
  if (!patientId) return res.status(400).send({ msg: 'patient id is requierd' });

  const newTreatment = await Treatment.create(req.body);

  // Update last treatment
  const patient = await Patient.findById(patientId);
  await patient.updateLastTreatment(date);
  await patient.resetLastCall();

  res.status(201).send(newTreatment);
});

// Edit treatment
router.put('/', async (req, res) => {
  const treatment = req.body;
  const { patientId, _id, date } = treatment;

  // Simple validation
  if (!patientId) return res.status(400).send({ msg: 'patient id is requierd' });
  if (!_id) return res.status(400).send({ msg: 'treatment id is requierd' });

  // Update treatment
  const editedTreatment = await Treatment.findByIdAndUpdate(_id, treatment, {
    new: true
  });

  // Update last treatment
  const patient = await Patient.findById(patientId);
  await patient.updateLastTreatment(date);

  res.status(200).send(editedTreatment);
});

module.exports = router;
