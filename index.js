const express = require('express');
const winston = require('winston');
const app = express();

const envPath =
  process.env.NODE_ENV === 'test' ? './.env.' + process.env.NODE_ENV : './.env';

console.log(envPath);

require('dotenv').config({ path: envPath });

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db.js')();

const port = process.env.PORT || 4000;
const server = app.listen(port, () =>
  winston.info('listening on http://localhost:' + port)
);
module.exports = server;
