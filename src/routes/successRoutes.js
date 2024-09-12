const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    // Foydalanuvchi ma'lumotlarini olish va sahifaga uzatish
    res.render('success', { userId });
});

module.exports = router;
