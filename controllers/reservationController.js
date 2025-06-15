const db = require('../db/database');

exports.getReservations = (req, res) => {
    db.query('SELECT * FROM reservation', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createReservation = (req, res) => {
    const { data, oferta, estado } = req.body;
    db.query(
        'INSERT INTO reservation (data, oferta, estado) VALUES (?, ?, ?)',
        [data, oferta, estado],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, data });
        }
    );
};
