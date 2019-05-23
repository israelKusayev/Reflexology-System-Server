const errorMiddleware = require('../../../middlewares/error');
const winston = require('winston');

describe('error middleware', () => {
  it('should return 500 error', () => {
    winston.error = (error, meta) => {};
    status = 0;
    returnObj = null;

    const res = {
      status: s => {
        status = s;
        return {
          send: obj => {
            returnObj = obj;
          }
        };
      }
    };
    errorMiddleware(new Error('error'), null, res, null);

    expect(status).toBe(500);
    expect(returnObj).toHaveProperty('msg');
  });
});
