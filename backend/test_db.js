require('dotenv').config();
const db = require('./config/db');
async function test() {
    try {
        const [rows] = await db.query('SELECT p.*, (SELECT image FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) as primary_image FROM products p LIMIT 1');
        console.log(JSON.stringify(rows[0], null, 2));
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}
test();
