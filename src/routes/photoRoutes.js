const express = require('express');
const router = express.Router();
const PhotoController = require('../controllers/photoController.js');

// Routes for photo upload
router.get('/photo/:id', (req, res) => {
    res.render('photo'); // Ensure that this route displays the photo upload page
});
router.post('/photo/:id', PhotoController.uploadMiddleware, PhotoController.uploadPhoto);

module.exports = router;
