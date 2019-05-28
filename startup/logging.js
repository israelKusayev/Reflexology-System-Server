const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = () => {
  winston.add(new winston.transports.File({ filename: 'logs/logfile.log' }));
  winston.add(
    new winston.transports.MongoDB({ db: process.env.DB_CONNECTION_STRING })
  );
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );

  winston.exceptions.handle([
    new winston.transports.File({ filename: 'logs/uncaughtExceptions.log' }),
    new winston.transports.Console()
  ]);
  process.on('unhandledRejection', ex => {
    console.log('WE GOT AN UNCAUGHT REJECTION');

    throw ex;
  });

  process.on('uncaughtException', ex => {
    console.log('WE GOT AN UNCAUGHT EXCEPTION');
  });
};
