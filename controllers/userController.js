const bcrypt = require('bcryptjs');
const db = require('../db/database');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username/Password are required' });
    }
    let User = await db.user.findOne({ where: { username: req.body.username } });
    if (!User) return res.status(404).json({ success: false, msg: "User not found." });
    
    const check = bcrypt.compareSync( req.body.password, User.password );
    if (!check) return res.status(401).json({ success:false, accessToken:null, msg:"Invalid credentials!" });
    
    const token = jwt.sign({ id: user.id, role: user.role },
    config.SECRET, { expiresIn: '24h' });
    return res.status(200).json({ success: true, accessToken: token , msg:"login successful"});
    
    
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
