const db = require('../config/db');

exports.addActivity = async (req, res) => {
    const { type, steps, calories } = req.body;
    const userId = req.user.id;
    try {
        await db.query(
            'INSERT INTO activities (user_id, type, steps, calories) VALUES (?, ?, ?, ?)',
            [userId, type, steps, calories]
        );
        res.json({ msg: "Activity tracked!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getActivities = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM activities WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.syncSteps = async (req, res) => {
    const { steps, calories } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    try {
        const [rows] = await db.query(
            'SELECT id FROM activities WHERE user_id = ? AND activity_date = ? AND activity_type = "walking"',
            [userId, today]
        );

        if (rows.length > 0) {
            await db.query(
                'UPDATE activities SET steps = ?, calories_burned = ? WHERE id = ?', 
                [steps, calories, rows[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO activities (user_id, activity_type, steps, calories_burned, activity_date) VALUES (?, "walking", ?, ?, ?)',
                [userId, steps, calories, today]
            );
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};