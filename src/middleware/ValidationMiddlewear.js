import * as yup from 'yup';

const createUserSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  balance: yup.number().min(0, 'Balance must be a positive number').optional(),
  cardNumber: yup.string().length(16, 'Card number must be 16 digits').optional(),
});

// Validation middleware funksiyasi
const ValidationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      // Schema orqali validatsiya qilish
      schema.validateSync(req.body, { abortEarly: false });

      // Agar validatsiya muvaffaqiyatli bo'lsa, req.body ni yangilash
      next();
    } catch (error) {
      // Agar xatolik bo'lsa, 400 status kodi bilan javob qaytarish
      res.status(400).json({
        name: "Validation Error",
        message: error.errors.join(', '),
      });
    }
  };
};

export { ValidationMiddleware, createUserSchema };
