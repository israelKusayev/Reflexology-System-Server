const mongoose = require('mongoose');

const authMiddleware = require('../../../middlewares/auth');
const User = require('../../../models/User');
require('dotenv').config();

describe('auth middleware', () => {
  let status;
  let req;
  let res;
  let mockJson;
  const next = jest.fn();

  beforeEach(() => {
    status = 0;
  });

  const setReq = token => {
    req = {
      header: jest.fn().mockReturnValue(token)
    };
  };

  const setRes = () => {
    mockJson = jest.fn();

    res = {
      status: s => {
        status = s;
        return {
          json: mockJson
        };
      }
    };
  };

  it('should return 401 error if token not provided', () => {
    setReq('');
    setRes();
    authMiddleware(req, res, next);

    expect(status).toBe(401);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson.mock.calls[0][0]).toHaveProperty('msg');
  });

  it('should return 401 error if token is not valid', () => {
    setReq('abcd');
    setRes();

    authMiddleware(req, res, next);

    expect(status).toBe(401);
    expect(mockJson.mock.calls.length).toBe(1);
    expect(mockJson.mock.calls[0][0]).toHaveProperty('msg');
  });

  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      username: 'israel',
      password: '1234'
    };
    const token = new User(user).generateAuthToken();
    setReq(token);

    authMiddleware(req, {}, next);
    delete user.password;
    expect(req.user).toMatchObject(user);
  });
});
