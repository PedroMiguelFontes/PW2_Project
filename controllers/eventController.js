const db = require('../db/database');

exports.getEvents = (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

exports.createEvent = (req, res) => {
    const { nome, tipo, duracao, data } = req.body;
    const loggedUserRole = req.loggedUserRole; 
    if (!nome || !tipo || !duracao || !data) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    if (loggedUserRole !== 'empregado') {
        return res.status(401).json({ error: 'Only facilitators can create events' });
    }
    db.query(
        'INSERT INTO events (nome, tipo, duracao, data) VALUES (?, ?, ?, ?)',
        [nome, tipo, duracao, data],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, nome, tipo, duracao, data });
        }
    );
};

exports.updateEvent = (req, res) => {
    const { id } = req.params;
    const { nome, tipo, duracao, data } = req.body;
    const loggedUserRole = req.loggedUserRole;
    if (!nome || !tipo || !duracao || !data) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    if (loggedUserRole !== 'admin') {
        return res.status(401).json({ error: 'Only admins can update events' });
    }
    db.query(
        'UPDATE events SET nome = ?, tipo = ?, duracao = ?, data = ? WHERE id = ?',
        [nome, tipo, duracao, data, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json({ message: 'Event updated successfully' });
        }
    );
};

exports.partialUpdateEvent = (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates).concat(id);
    const loggedUserRole = req.loggedUserRole;

    if (loggedUserRole !== 'admin') {
        return res.status(401).json({ error: 'Only admins can update events' });
    }
    db.query(
        `UPDATE events SET ${fields} WHERE id = ?`,
        values,
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json({ message: 'Event updated successfully' });
        }
    );
};

exports.deleteEvent = (req, res) => {
    const { id } = req.params;
    const loggedUserRole = req.loggedUserRole; 
    if(loggedUserRole !== 'admin') {
        return res.status(401).json({ error: 'Only admins can delete events' });
    }
    db.query('DELETE FROM events WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(204).json({ message: 'Event deleted successfully' });
    });
};