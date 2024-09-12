const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');

router.get('/details/:id', UserController.getUserDetails);
router.post('/update-password/:id', UserController.updatePassword);

module.exports = router;
