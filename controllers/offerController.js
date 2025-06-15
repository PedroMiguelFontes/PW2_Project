const db = require('../db/database');

exports.getOffers = (req, res) => {
    db.query('SELECT * FROM offer', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createOffer = (req, res) => {
    const { zona, disponibilidade, nrCamas, classificacao, tipo, comodidades } = req.body;
    db.query(
        'INSERT INTO offer (zona, disponibilidade, nrCamas, classificacao, tipo, comodidades) VALUES (?, ?, ?, ?, ?, ?)',
        [zona, disponibilidade, nrCamas, classificacao, tipo, comodidades],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, zona });
        }
    );
};
