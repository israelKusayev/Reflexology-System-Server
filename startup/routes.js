const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authMiddleware = require('../middlewares/auth');
const remindersRouter = require('../routes/reminders');
const patientsRouter = require('../routes/patients');
const treatmentsRouter = require('../routes/treatments');
const authRouter = require('../routes/auth');

module.exports = app => {
  // middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // routes
  app.use('/api/auth', authRouter);
  app.use(authMiddleware);
  app.use('/api/patients', patientsRouter);
  app.use('/api/treatments', treatmentsRouter);
  app.use('/api/reminders', remindersRouter);

  // error middlewae
  app.use(require('../middlewares/error'));
};
