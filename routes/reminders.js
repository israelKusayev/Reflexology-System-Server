const router = require('express').Router();
const Treatment = require('../models/Treatment');
const mongoose = require('mongoose');
const moment = require('moment');

// Get all reminders
router.get('/', async (req, res) => {
  let condition;

  if (req.query.newReminders === 'new')
    condition = {
      $and: [
        {
          isReminderCompleted: { $eq: false },
          reminderDate: { $lte: new Date() }
        }
      ]
    };
  else
    condition = {
      $and: [
        {
          reminderDate: { $ne: null }
        }
      ]
    };

  const reminders = await Treatment.aggregate([
    {
      $match: condition
    },
    {
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: '_id',
        as: 'patient'
      }
    },
    {
      $match: {
        'patient.createdBy': { $eq: mongoose.Types.ObjectId(req.user._id) }
      }
    },
    {
      $project: {
        reminders: 1,
        reminderDate: 1,
        isReminderCompleted: 1,
        'patient.firstName': 1,
        'patient.lastName': 1,
        'patient._id': 1
      }
    },
    { $sort: { reminderDate: -1 } }
  ]);
  res.status(200).send(reminders);
});

router.get('/newRemindersCount', async (req, res) => {
  const count = await Treatment.aggregate([
    {
      $match: {
        $and: [
          {
            isReminderCompleted: { $eq: false },
            reminderDate: { $lte: new Date() }
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: '_id',
        as: 'patient'
      }
    },
    {
      $match: {
        'patient.createdBy': { $eq: mongoose.Types.ObjectId(req.user._id) }
      }
    },
    {
      $count: 'count'
    }
  ]);

  res.status(200).send(count[0]);
});

router.patch('/:treatmentId', async (req, res) => {
  if (req.body.reminderDate)
    req.body.reminderDate = moment.utc(req.body.reminderDate, 'DD/MM/YYYY'); //TODO validate date

  const treatment = await Treatment.findByIdAndUpdate(
    req.params.treatmentId,
    {
      $set: req.body
    },
    { new: true }
  );

  if (!treatment) return res.status(400).end({ msg: 'טיפול לא נמצא לתזכורת' }); // todo;

  res.status(204).end();
});
module.exports = router;
