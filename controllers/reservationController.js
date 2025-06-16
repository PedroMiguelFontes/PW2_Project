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

exports.updateReservation = (req, res) => {
    const { id } = req.params;
    const { data, oferta, estado } = req.body;
    db.query(
        'UPDATE reservation SET data = ?, oferta = ?, estado = ? WHERE id = ?',
        [data, oferta, estado, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Reservation not found' });
            }
            res.json({ message: 'Reservation updated successfully' });
        }
    );
}

exports.partialUpdateReservation = (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates).concat(id);

    db.query(
        `UPDATE reservation SET ${fields} WHERE id = ?`,
        values,
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Reservation not found' });
            }
            res.json({ message: 'Reservation updated successfully' });
        }
    );
}

exports.deleteReservation = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM reservation WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json({ message: 'Reservation deleted successfully' });
    });
};  