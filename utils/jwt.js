const jwt = require('jsonwebtoken');

/**
 *
 * @param {{_id:string, name:string}} user
 */
const createToken = user => {
  return jwt.sign(
    { _id: user._id, name: user.name },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: 3600
    }
  );
};

module.exports = { createToken };
