const User = require('../models/User.js');
const bcrypt = require('bcrypt');

class UserController {
    // Foydalanuvchi ma'lumotlarini olish
    static async getUserDetails(req, res) {
        const { id } = req.params;

        try {
            const user = await User.findByPk(id);

            if (!user) {
                return res.redirect('/?error=User%20not%20found'); // Foydalanuvchi topilmadi
            }

            res.render('photo', { user, messages: req.query });
        } catch (err) {
            console.error('Xatolik:', err);
            res.redirect('/?error=Failed%20to%20fetch%20user%20details'); // Xatolik yuz berdi
        }
    }

    // Foydalanuvchi ma'lumotlarini yangilash
    static async updateUserDetails(req, res) {
        const { id } = req.params;
        const { passport, address, nationality } = req.body;
        const photo = req.file ? req.file.filename : '';

        try {
            const user = await User.findByPk(id);

            if (!user) {
                return res.redirect('/?error=User%20not%20found'); // Foydalanuvchi topilmadi
            }

            await user.update({ passport, address, nationality, photo });

            res.redirect(`/success/${id}?message=User%20details%20updated%20successfully`);
        } catch (err) {
            console.error('Xatolik:', err);
            res.redirect(`/details/${id}?error=Database%20update%20failed`); // Ma'lumotlar bazasini yangilashda xatolik
        }
    }
    // Parolni yangilash
    static async updatePassword(req, res) {
        const { id } = req.params;
        const { currentPassword, newPassword, confirmPassword } = req.body;
    
        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, error: 'New passwords do not match' });
        }
    
        try {
            // Find the user by ID
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
    
            // Check if the current password matches the one in the database
            if (user.password !== currentPassword) {
                return res.status(401).json({ success: false, error: 'Current password is incorrect' });
            }
    
            // Update the user's password
            await user.update({ password: newPassword });
    
            res.json({ success: true });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ success: false, error: 'Failed to update password' });
        }
    }
    
}

module.exports = UserController;
