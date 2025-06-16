const jwt = require('jsonwebtoken');
exports.verifyToken = (req, res, next) => {
    const header = req.headers['x-access-token'] || req.headers.authorization;
    if (typeof header == 'undefined')
    return res.status(401).json({ success: false, msg: "No token provided!" });
    const bearer = header.split(' '); 
    const token = bearer[1];
    try {
    let decoded = jwt.verify(token, process.env.SECRET);
    req.loggedUserId = decoded.id; 
    req.loggedUserRole = decoded.role;
    next();
    } catch (err) {
    return res.status(401).json({ success: false, msg: "Unauthorized!" });
    }
    };