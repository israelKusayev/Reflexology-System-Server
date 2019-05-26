const errorMiddleware = require('../../../middlewares/error');
const winston = require('winston');

describe('error middleware', () => {
  it('should return 500 error', () => {
    winston.error = jest.fn();
    status = 0;

    const mockJson = jest.fn();
    const res = {
      status: s => {
        status = s;
        return {
          json: mockJson
        };
      }
    };
    errorMiddleware(new Error('error'), null, res, null);

    expect(status).toBe(500);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson.mock.calls[0][0]).toHaveProperty('msg');
  });
});
