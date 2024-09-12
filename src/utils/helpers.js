const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Parolni hash qilish
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

// Parolni solishtirish
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'kamron'; // Muhim: Bu qiymatni xavfsiz saqlang
const JWT_EXPIRATION = '1h'; // Access tokenning amal qilish muddati
const JWT_REFRESH_EXPIRATION = '7d'; // Refresh tokenning amal qilish muddati

const generateToken = (userId, type = 'access') => {
    const expiresIn = type === 'access' ? JWT_EXPIRATION : JWT_REFRESH_EXPIRATION;
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };


module.exports = { hashPassword, comparePassword };
