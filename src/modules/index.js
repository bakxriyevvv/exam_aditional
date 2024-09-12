const express = require('express');
const userRoutes = require('./user/user.routes.js'); // User CRUD marshrutlari

const router = express.Router();

router.use('/user', userRoutes); // User CRUD marshrutlari

module.exports = router;
