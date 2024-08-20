const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const db = require('./database');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/userimage');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const generateCardNumber = () => {
    return '4000' + Math.floor(Math.random() * 1000000000000000).toString().padStart(12, '0');
};

// Home route
app.get('/', (req, res) => {
    res.render('register');
});

// Login route
app.get('/login', (req, res) => {
    res.render('login');
});

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    db.query('SELECT * FROM users WHERE username = $1', [username], (err, results) => {
        if (err) throw err;

        if (results.rows.length > 0) {
            return res.redirect('/');
        }

        const newUser = {
            username,
            password,
            passport: '',
            address: '',
            nationality: '',
            photo: '',
            cardNumber: generateCardNumber(),
            balance: 10000.00
        };

        db.query('INSERT INTO users (username, password, passport, address, nationality, photo, cardNumber, balance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', 
            [newUser.username, newUser.password, newUser.passport, newUser.address, newUser.nationality, newUser.photo, newUser.cardNumber, newUser.balance], 
            (err, result) => {
            if (err) throw err;

            res.redirect(`/details?id=${result.rows[0].id}`);
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, results) => {
        if (err) throw err;

        if (results.rows.length > 0) {
            res.redirect(`/success?id=${results.rows[0].id}`);
        } else {
            res.redirect('/login');
        }
    });
});

// Details route (GET)
app.get('/details', (req, res) => {
    const { id } = req.query;

    db.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
        if (err) throw err;

        if (results.rows.length === 0) {
            return res.redirect('/');
        }

        res.render('details', { user: results.rows[0] });
    });
});

// Success route
app.get('/success', (req, res) => {
    const { id } = req.query;

    db.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
        if (err) throw err;

        if (results.rows.length === 0) {
            return res.redirect('/');
        }

        res.render('success', { user: results.rows[0], messages: {}, transactions: [] });
    });
});

app.post('/transfer', (req, res) => {
    const { id } = req.query;
    const { transferTo, amount } = req.body;

    if (!transferTo || transferTo.length !== 16) {
        
        return res.redirect(`/success?id=${id}&error=Invalid%20card%20number`);
    }
    if (amount <= 0) {
        return res.redirect(`/success?id=${id}&error=Invalid%20amount`);
    }

// Retrieve user information
    db.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
        if (err) throw err;

        const user = results.rows[0];
        if (!user) {
            return res.redirect(`/success?id=${id}&error=User%20not%20found`);
        }

        // Check if the user has enough balance
        if (user.balance < amount) {
            return res.redirect(`/success?id=${id}&error=Insufficient%20balance`);
        }

        // Deduct the amount from user's balance
        const newBalance = user.balance - amount;

        // Update the user's balance in the database
        db.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, id], (err, updateResult) => {
            if (err) throw err;

            // Record the transaction (this part is optional, depends on your design)
            db.query('INSERT INTO transactions (user_id, type, amount, date) VALUES ($1, $2, $3, NOW())', 
                [id, 'transfer', amount], (err, transactionResult) => {
                if (err) throw err;

                // Redirect back to the success page
                res.redirect(`/success?id=${id}&success=Transfer%20successful`);
            });
        });
    });
});

// Details route (POST)
app.post('/details', upload.single('photo'), (req, res) => {
    const { passport, address, nationality, id } = req.body;
    const photo = req.file ? req.file.filename : '';

    db.query('UPDATE users SET passport = $1, address = $2, nationality = $3, photo = $4 WHERE id = $5', 
        [passport, address, nationality, photo, id], 
        (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.redirect(`/details?id=${id}&error=Database%20update%20failed`);
        }

        res.redirect(`/success?id=${id}`);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});