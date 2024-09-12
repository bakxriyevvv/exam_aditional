const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController.js');
const UserController = require('../controllers/userController.js');
const PhotoController = require('../controllers/photoController.js');
const SuccessController = require('../controllers/successController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer for photo upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads/userimage');
        // Ensure the directory exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Home routes
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/photo', (req, res) => {
    res.render('photo');
});
router.get('/success', (req, res) => {
    res.render('success');
});
router.get('/', (req, res) => {
    res.render('index'); // `views/index.ejs` faylini render qilish
});

router.post('/register', upload.single('photo'), AuthController.register);
router.post('/login', AuthController.login);
router.get('/photo/:id', UserController.getUserDetails); // Show the page to upload photo
router.post('/photo/:id', PhotoController.uploadMiddleware, PhotoController.uploadPhoto); // Handle photo upload
router.get('/success/:id', SuccessController.getSuccessPage);

module.exports = router;
