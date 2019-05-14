const monggose = require('mongoose');
const winston = require('winston');

// Connect to MongoDb
module.exports = () => {
  monggose
    .connect(process.env.DB_CONNECTION_STRING, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      winston.info('MongoDB Connected...');
    })
    .catch(err => winston.error('Failed to connect to MongoDB', err));
};
