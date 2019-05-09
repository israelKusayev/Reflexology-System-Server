const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token)
    return res.status(401).json({ msg: 'No token, authorizaton denied' });

  try {
    // Verify token
    const decoded = jwt.decode(token, config.secretKey);
    if (!decoded) return res.status(401).json({ msg: 'Token is not valid' });

    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
