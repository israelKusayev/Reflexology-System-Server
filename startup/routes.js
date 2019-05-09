const express = require('express');
const cors = require('cors');
const auth = require('../middlewares/auth');

module.exports = app => {
  // middlewares
  app.use(cors());
  app.use(express.json());

  // routes
  app.use('/api/auth', require('../routes/auth'));
  app.use(auth);
  app.use('/api/patients', require('../routes/patients'));
  app.use('/api/treatments', require('../routes/treatments'));

  // error middlewae
  app.use(require('../middlewares/error'));
};
