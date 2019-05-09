const express = require('express');
const winston = require('winston');
const app = express();

require('dotenv').config();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db.js')();
// require('./drive');

const port = process.env.PORT || 4000;
app.listen(port, () => winston.info('listening on http://localhost:' + port));
