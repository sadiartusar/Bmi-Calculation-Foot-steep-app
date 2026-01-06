const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 20403, // Number-এ রূপান্তর করা হলো
    ssl: {
        rejectUnauthorized: false 
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000 // ২০ সেকেন্ড সময় দিন কানেক্ট হতে
});

// কানেকশন চেক করার জন্য একটি টেস্ট
pool.getConnection((err, connection) => {
    if (err) {
        console.error("ডাটাবেস কানেকশন এরর:", err.message);
    } else {
        console.log("ডাটাবেস কানেকশন সফল হয়েছে!");
        connection.release();
    }
});

module.exports = pool.promise();