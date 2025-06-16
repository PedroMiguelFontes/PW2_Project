const db = require('../db/database');

exports.getOffers = (req, res) => {
    db.query('SELECT * FROM offer', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

exports.createOffer = (req, res) => {
    const { zona, disponibilidade, nrCamas, classificacao, tipo, comodidades } = req.body;
    const loggedUserRole = req.loggedUserRole;
    if (!zona || !disponibilidade || !nrCamas || !classificacao || !tipo || !comodidades) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    if (loggedUserRole !== 'empregado') {
        return res.status(403).json({ error: 'Only facilitators can create offers' });
    }
    db.query(
        'INSERT INTO offer (zona, disponibilidade, nrCamas, classificacao, tipo, comodidades) VALUES (?, ?, ?, ?, ?, ?)',
        [zona, disponibilidade, nrCamas, classificacao, tipo, comodidades],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, zona });
        }
    );
};

exports.updateOffer = (req, res) => {
    const { id } = req.params;
    const { zona, disponibilidade, nrCamas, classificacao, tipo, comodidades } = req.body;
    if (!zona || !disponibilidade || !nrCamas || !classificacao || !tipo || !comodidades) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    const loggedUserRole = req.loggedUserRole;
    if (loggedUserRole !== 'admin') {
        return res.status(403).json({ error: 'Only admins can update offers' });
    }

    db.query(
        'UPDATE offer SET zona = ?, disponibilidade = ?, nrCamas = ?, classificacao = ?, tipo = ?, comodidades = ? WHERE id = ?',
        [zona, disponibilidade, nrCamas, classificacao, tipo, comodidades, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Offer not found' });
            }
            res.json({ message: 'Offer updated successfully' });
        }
    );
};

exports.partialUpdateOffer = (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates).concat(id);
    const loggedUserRole = req.loggedUserRole;

    if (loggedUserRole !== 'admin') {
        return res.status(403).json({ error: 'Only admins can update offers' });
    }

    db.query(
        `UPDATE offer SET ${fields} WHERE id = ?`,
        values,
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Offer not found' });
            }
            res.json({ message: 'Offer updated successfully' });
        }
    );
};

exports.deleteOffer = (req, res) => {
    const { id } = req.params;
    const loggedUserRole = req.loggedUserRole;
    if (loggedUserRole !== 'admin') {
        return res.status(403).json({ error: 'Only admins can delete offers' });
    }
    db.query('DELETE FROM offer WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        res.json({ message: 'Offer deleted successfully' });
    });
};