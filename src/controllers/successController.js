const User = require('../models/User.js');
const path = require('path');

class SuccessController {
    static async getSuccessPage(req, res) {
        const userId = req.params.id;

        try {
            // Foydalanuvchini ID bo'yicha qidirish
            const user = await User.findByPk(userId);
            if (!user) {
                return res.redirect('/?error=Foydalanuvchi%20topilmadi');
            }

            // Rasm manzilini to'g'ri formatda olish
            const photoPath = user.photo ? `${user.photo}` : null;

            // Foydalanuvchini muvaffaqiyat sahifasiga yuborish
            res.render('success', {
                user: {
                    username: user.username,
                    photo: photoPath, // Rasm manzili
                    balance: user.balance,
                    id: user.id,
                },
                messages: {
                    success: req.query.message,
                    error: req.query.error
                }
            });
        } catch (error) {
            console.error('Muvaffaqiyat sahifasini olishda xatolik:', error);
            res.redirect('/?error=Ma\'lumotlarni%20olishda%20xatolik');
        }
    }
}

module.exports = SuccessController;
