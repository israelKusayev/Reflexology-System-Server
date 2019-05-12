const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// login
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password)
    return res.status(400).json({ msg: 'נא למלא את כל השדות' });

  // Check for existing user
  const user = await User.findOne({ username: username.trim() });
  if (!user) return res.status(400).send({ msg: 'שם משתמש לא קיים' });

  // Validate password
  const valid = await bcrypt.compare(password.trim(), user.password.trim());
  if (!valid) return res.status(400).send({ msg: 'סיסמא שגוייה' });

  // Create token
  const token = user.generateAuthToken();

  return res.status(200).send({ token });
});
module.exports = router;
