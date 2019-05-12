const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: '1234'
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    expect(decoded).toMatchObject(payload);
  });
});
