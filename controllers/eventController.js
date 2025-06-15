const db = require('../db/database');

exports.getEvents = (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createEvent = (req, res) => {
    const { nome, tipo, duracao, data } = req.body;
    db.query(
        'INSERT INTO events (nome, tipo, duracao, data) VALUES (?, ?, ?, ?)',
        [nome, tipo, duracao, data],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, nome });
        }
    );
};
