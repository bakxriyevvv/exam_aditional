const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database.js');
const indexRoutes = require('./routes/index.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const photoRoutes = require('./routes/photoRoutes.js');
const successRoutes = require('./routes/successRoutes.js');
const routes = require('./modules/index.js');

require('dotenv').config();

const app = express();
const PORT = 3005;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use(express.json());

// To serve all uploads
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/photo', photoRoutes);
app.use('/success', successRoutes); // Ensure proper routing

app.use('/api/v1', routes);

// Database synchronization
db.sync({ force: true })
    .then(() => {
    })
    .catch(err => {
        console.error('Error creating tables:', err);
    });
    

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/register`);
});
