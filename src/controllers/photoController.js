const path = require('path');
const multer = require('multer');
const User = require('../models/User.js');

// Multer konfiguratsiyasi
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/userimage');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Photo upload functionality
const PhotoController = {
    uploadPhoto: async (req, res) => {
        const userId = req.params.id;
        const photo = req.file ? req.file.filename : '';

        try {
            // Find the user by ID
            const user = await User.findByPk(userId);
            if (!user) {
                return res.redirect('/?error=User%20not%20found');
            }

            // Update user's photo
            user.photo = photo;
            await user.save();

            // Redirect to success page
            res.redirect(`/success/${user.id}?message=Photo%20uploaded%20successfully`);
        } catch (error) {
            console.error('Error uploading photo:', error);
            res.redirect(`/photo/${userId}?error=Photo%20upload%20failed`);
        }
    },

    uploadMiddleware: upload.single('photo') // Multer middleware for handling single file upload
};

module.exports = PhotoController;
