const { createToken } = require('../../../utils/jwt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('JWT', () => {
  it('should return a valid JWT', () => {
    const user = { _id: '121wq21', name: 'israel' };

    const token = createToken(user);

    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    expect(decoded).toMatchObject(user);
  });
});
