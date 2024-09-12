// routes/userRoutes.js
const express = require('express');
const UserController = require('./user.controller.js');

const router = express.Router();

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/verify-otp/:id', UserController.verifyOTP);
module.exports = router;
