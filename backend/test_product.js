require('dotenv').config();
const { getProductById } = require('./services/productService');
async function test() {
    try {
        const p = await getProductById(1);
        console.log(JSON.stringify(p, null, 2));
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}
test();
