require('dotenv').config();
const db = require('./config/db');
async function test() {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@gearnix.com']);
        console.log('Users:', users);
        const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', ['admin@gearnix.com']);
        console.log('Admins:', admins);
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}
test();
