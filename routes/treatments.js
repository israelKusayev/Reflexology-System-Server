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

  const newTreatment = await Treatment.create(req.body);

  // Update last treatment
  const patient = await Patient.findById(patientId);
  await patient.updateLastTreatment(date);

  res.status(201).send(newTreatment);
});

// Edit treatment
router.put('/', async (req, res) => {
  const { patientId, date } = req.body;

  // Update treatment
  const treatment = req.body;
  const editedTreatment = await Treatment.findByIdAndUpdate(
    treatment._id,
    treatment,
    { new: true }
  );

  // Update last treatment
  const patient = await Patient.findById(patientId);
  await patient.updateLastTreatment(date);

  res.status(200).send(editedTreatment);
});

module.exports = router;
