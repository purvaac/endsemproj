const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };