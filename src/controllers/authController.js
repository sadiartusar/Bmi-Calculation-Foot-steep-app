const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
     console.log("নতুন রেজিস্ট্রেশন রিকোয়েস্ট এসেছে:", req.body);
    const { name, email, password, height, weight } = req.body;
    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, height, weight) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, height, weight]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, userId: result.insertId, msg: "Registration successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        
        res.json({ 
            token, 
            user: { 
                id: users[0].id, 
                name: users[0].name, 
                email: users[0].email,
                height: users[0].height, 
                weight: users[0].weight,
                created_at: users[0].created_at
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};