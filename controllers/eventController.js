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

exports.updateEvent = (req, res) => {
    const { id } = req.params;
    const { nome, tipo, duracao, data } = req.body;
    db.query(
        'UPDATE events SET nome = ?, tipo = ?, duracao = ?, data = ? WHERE id = ?',
        [nome, tipo, duracao, data, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json({ message: 'Event updated successfully' });
        }
    );
};

exports.partialUpdateEvent = (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates).concat(id);

    db.query(
        `UPDATE events SET ${fields} WHERE id = ?`,
        values,
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json({ message: 'Event updated successfully' });
        }
    );
};