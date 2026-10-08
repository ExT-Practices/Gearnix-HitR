require('dotenv').config();
const db = require('./config/db');
async function test() {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE name LIKE "%Keyboard%"');
        console.log("Product:", JSON.stringify(rows[0], null, 2));
        if (rows[0]) {
            const [imgRows] = await db.query('SELECT * FROM product_images WHERE product_id = ?', [rows[0].id]);
            console.log("Images:", JSON.stringify(imgRows, null, 2));
        }
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}
test();
