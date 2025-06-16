const bcrypt = require('bcryptjs');
const db = require('../db/database');
const jwt = require('jsonwebtoken');
const config = require('../config'); 

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and/or password are required' });
    }

    
    db.query('SELECT * FROM user WHERE username = ? AND password= ?', [username,password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({success:false,accessToken:null,msg: 'Invalid credentials' });
        }

            
        const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                config.SECRET,
                { expiresIn: '24h' }
        );

        return res.status(200).json({
            accessToken: token,      
        });
        });
};


exports.getUsers = (req, res) => {
    db.query('SELECT username,role FROM user', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

exports.createUser = (req, res) => {
    const { username, password, role } = req.body;
    db.query('INSERT INTO user (username, password, role) VALUES (?, ?, ?)', [username, password,role], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, username, role });
    });
};
