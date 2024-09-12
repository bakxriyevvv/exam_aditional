const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AuthController = require('../controllers/authController.js');

// Multer for photo upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/userimage';
        // Ensure the directory exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Define routes
router.post('/register', upload.single('photo'), AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;
