// controllers/UserController.js
const bcrypt = require('bcrypt');
const User = require('../../models/User'); // User modelini to'g'ri yo'ldan import qilish
const { sendOTPEmail } = require('../../utils/emailUtils');
const crypto = require('crypto');

class UserController {
    // Create - Yangi user qo'shish
    static async createUser(req, res) {
        const { username, email, password, balance, cardNumber } = req.body;
    
        // Kerakli ma'lumotlarning mavjudligini tekshirish
        if (!username || !email || !password || !cardNumber) {
            return res.status(400).json({
                success: false,
                message: 'Kerakli ma\'lumotlar yetishmayapti'
            });
        }
    
        try {
            // Parolni hash qilish
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Tasodifiy 6 xonali OTP yaratish
            const otp = Math.floor(100000 + Math.random() * 900000);
            console.log(otp)
    
            // Foydalanuvchi yaratish
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,  // Hashlangan parol
                balance,
                cardNumber,
                otp: otp,                    // OTP ni yozish
                isVerified: false           // Dastlab foydalanuvchi tasdiqlanmagan
            });
    
            // OTP ni foydalanuvchiga yuborish (email orqali)
            await sendOTPEmail(email, otp);
    
            // Muvaffaqiyatli javob qaytarish
            res.status(201).json({
                success: true,
                message: 'Foydalanuvchi muvaffaqiyatli qo\'shildi. Email orqali OTP yuborildi.',
                data: newUser
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                success: false,
                message: 'Foydalanuvchini qo\'shishda xatolik',
            });
        }
    }

    // Read - Barcha userlarni olish
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({
                success: false,
                message: 'Foydalanuvchilarni olishda xatolik',
            });
        }
    }

    // Read - Bitta userni olish (ID bo'yicha)
    static async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Foydalanuvchi topilmadi'
                });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Error getting user by ID:', error);
            res.status(500).json({
                success: false,
                message: 'Foydalanuvchini olishda xatolik',
            });
        }
    }

    // Update - Userni yangilash
    static async updateUser(req, res) {
        const { id } = req.params;
        const { username, email, balance, password } = req.body;

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Foydalanuvchi topilmadi'
                });
            }

            // Agar parol yangilanayotgan bo'lsa, parolni hash qilamiz
            const updatedData = { username, email, balance };
            if (password) {
                updatedData.password = await bcrypt.hash(password, 10);
            }

            await user.update(updatedData);
            res.status(200).json({
                success: true,
                message: 'Foydalanuvchi muvaffaqiyatli yangilandi',
                data: user
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({
                success: false,
                message: 'Foydalanuvchini yangilashda xatolik',
            });
        }
    }

    // Delete - Userni o'chirish
    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Foydalanuvchi topilmadi'
                });
            }
            await user.destroy();
            res.status(200).json({
                success: true,
                message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi'
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Foydalanuvchini o\'chirishda xatolik',
            });
        }
    }

    // Verify OTP
    static async verifyOTP(req, res) {
        const { id } = req.params; 
        const { otp } = req.body;
    
        try {
            // Foydalanuvchini ID bo'yicha qidirish
            const user = await User.findOne({ where: { id: id } }); 
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Foydalanuvchi topilmadi'
                });
            }
            console.log(user);
    
            
            console.log('DBdagi OTP:', user);
            // console.log('Kiritilgan OTP:', otp);
    
            // OTP to'g'riligini tekshirish
            if (parseInt(otp) !== user.otp) {
                return res.status(400).json({
                    success: false,
                    message: 'Noto‘g‘ri OTP'
                });
            }
    
            // // OTP amal qilish muddatini tekshirish
            // if (user.otpExpires && user.otpExpires < Date.now()) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'OTP amal qilish muddati tugagan'
            //     });
            // }
    
            // Foydalanuvchini tasdiqlash
            user.isVerified = true;
            user.otp = null; // OTP ni tozalash
            user.otpExpires = null; // OTP amal qilish vaqtini tozalash
            await user.save();
    
            // Muvaffaqiyatli javob qaytarish
            res.status(200).json({
                success: true,
                message: 'Email muvaffaqiyatli tasdiqlandi',
                data: user
            });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            res.status(500).json({
                success: false,
                message: 'OTP tasdiqlashda xatolik',
            });
        }
    }
    
}

module.exports = UserController;
