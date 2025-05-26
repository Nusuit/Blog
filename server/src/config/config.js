const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log("PORT:", process.env.PORT);
console.log("USER:", process.env.USER);
const config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};
module.exports = config;