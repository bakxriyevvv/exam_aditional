const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bankist',
    password: '1421',
    port: 5432,
});
pool.connect((err) => {
    if (err) {
        console.error('PostgreSQL ga ulanishda xatolik: ', err);
    } else {
        console.log('MONGOGA ULANISH ga ulanish muvaffaqiyatli amalga oshirildi.');
    }
});



module.exports = pool;