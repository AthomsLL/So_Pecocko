const jwt = require('jsonwebtoken');
const config = require('../config/main');

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return new Error("Aucun token d'autorisation trouvé !");
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};