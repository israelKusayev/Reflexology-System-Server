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
  const Newtreatment = await Treatment.create(req.body);
  await Patient.findByIdAndUpdate(req.body.patientId, {
    lastTreatment: req.body.date
  });
  res.status(201).send(Newtreatment);
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

  if (!patient.lastTreatment) {
    await Patient.findByIdAndUpdate(patientId, {
      lastTreatment: date
    });
  } else {
    const lastTreatment = await Treatment.findOne(
      { patientId: req.body.patientId },
      'date',
      {
        sort: {
          date: -1 //Sort by Date Added DESC
        }
      }
    );

    patient.lastTreatment = lastTreatment.date;
    await Patient.findByIdAndUpdate(patientId, patient);
  }

  res.status(200).send(editedTreatment);
});

module.exports = router;
