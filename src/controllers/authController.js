const { hashPassword, comparePassword } = require('../utils/helpers.js');
const User = require('../models/User.js');

// Card raqami yaratish funksiyasi
const generateCardNumber = () => {
    return '4000' + Math.floor(Math.random() * 1000000000000000).toString().padStart(16, '0');
};

const AuthController = {
    // Ro'yxatdan o'tish funksiyasi
    register: async (req, res) => {
        const { username, password } = req.body;
        const photo = req.file ? req.file.filename : ''; // Faylni olish

        try {
            // Foydalanuvchi nomi mavjudligini tekshirish
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Parolni xesh qilish
            const hashedPassword = await hashPassword(password);

            // Yangi foydalanuvchini yaratish
            const newUser = await User.create({
                username,
                password: hashedPassword,
                photo, // Fayl nomini saqlash
                cardNumber: generateCardNumber(),
                balance: 10000.00
            });

            // Muvaffaqiyatli sahifaga yo'naltirish
            res.redirect(`/photo/${newUser.id}`);
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Registration failed', details: error.message });
        }
    },

    // Kirish funksiyasi
    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            // Foydalanuvchini foydalanuvchi nomi bo'yicha qidirish
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Parolni tekshirish
            const isMatch = await comparePassword(password, user.password);
            if (isMatch) {
                // Muvaffaqiyatli sahifaga yo'naltirish
                res.redirect(`/success/${user.id}`);
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ error: 'Login failed', details: error.message });
        }
    }
};

module.exports = AuthController;
