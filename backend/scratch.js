require("dotenv").config();
const db = require("./config/db");

async function checkProc() {
    try {
        const [rows] = await db.query(`
            SHOW CREATE PROCEDURE sp_update_admin;
        `);
        console.log("Procedure definition:");
        console.log(rows[0]['Create Procedure']);
    } catch(err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
checkProc();
