const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.js');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.user = user;
        next();
    });
};

module.exports = authMiddleware;
