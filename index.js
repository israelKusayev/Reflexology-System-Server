const express = require('express');
const winston = require('winston');
const app = express();

const envPath = process.env.NODE_ENV === 'test' ? './.env.' + process.env.NODE_ENV : './.env';

require('dotenv').config({ path: __dirname + '/' + envPath });

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db.js')();

const port = process.env.PORT || 4000;
const server = app.listen(port, () => winston.info('listening on http://localhost:' + port));
module.exports = server;
