require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seedCustomer() {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', ['customer@gearnix.com']);
        if (users.length > 0) {
            console.log('Customer already exists, updating password to "password"');
            const hashedPassword = await bcrypt.hash('password', 10);
            await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'customer@gearnix.com']);
        } else {
            console.log('Inserting customer@gearnix.com');
            const hashedPassword = await bcrypt.hash('password', 10);
            await db.query(
                "INSERT INTO users (name, email, password, phone, status) VALUES (?, ?, ?, ?, ?)",
                ["Test Customer", "customer@gearnix.com", hashedPassword, "1234567890", "active"]
            );
        }
        console.log('Done');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seedCustomer();
