const router = require('express').Router();
const Treatment = require('../models/Treatment');
const Patient = require('../models/Patient');

// Get all treatments according to patient id
router.get('/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const treatments = await Treatment.find({ patientId }).sort({ _id: 'desc' });

  res.status(200).send(treatments);
});

// Add new treatment
router.post('/', async (req, res) => {
  const Newtreatment = await Treatment.create(req.body);
  await Patient.findByIdAndUpdate(req.body.patientId, {
    lastTreatment: req.body.date
  });
  res.status(201).send(Newtreatment);
});

// Edit treatment
router.put('/', async (req, res) => {
  const treatment = req.body;
  const editedTreatment = await Treatment.findByIdAndUpdate(
    treatment._id,
    treatment,
    { new: true }
  );

  res.status(200).send(editedTreatment);
});

module.exports = router;
