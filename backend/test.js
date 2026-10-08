require('dotenv').config();
const db = require('./config/db');

async function updatePassword() {
    const hash = "$2b$10$aJ7smOHDhey/Dl.hRG3a/OrzHaEg/PKhXWC1XVlamIHWkgLFUBb3K";
    await db.query("UPDATE admins SET password = ? WHERE email = ?", [hash, "admin@gearnix.com"]);
    console.log("Password successfully updated to correct hash");
    process.exit();
}

updatePassword().catch(console.error);
