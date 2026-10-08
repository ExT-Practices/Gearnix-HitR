require('dotenv').config();
const db = require('./config/db');

async function updateDb() {
    await db.query(`DROP PROCEDURE IF EXISTS sp_create_payment;`);
    await db.query(`
    CREATE PROCEDURE sp_create_payment(
        IN p_order_id INT,
        IN p_razorpay_order_id VARCHAR(100),
        IN p_amount DECIMAL(10,2)
    )
    BEGIN
        INSERT INTO payments (
            order_id,
            user_id,
            razorpay_order_id,
            amount,
            currency,
            status
        )
        SELECT 
            p_order_id,
            user_id,
            p_razorpay_order_id,
            p_amount,
            'INR',
            'created'
        FROM orders WHERE id = p_order_id
        ON DUPLICATE KEY UPDATE
            amount = VALUES(amount);

        SELECT TRUE AS success, 'Payment record created' AS message;
    END
    `);
    console.log("DB updated successfully");
    process.exit();
}

updateDb().catch(console.error);
