const jwt = require('jsonwebtoken');

function signJwt(user_id, isAdmin) {
    const token = jwt.sign({sub: user_id, admin: isAdmin}, process.env.SECRET);
    if (!token) return false;
    return token;
}

function verifyJwt(req, res, next) {
    const authorization = req.header('authorization');
    const token = authorization ? authorization.split('Bearer ')[1] : undefined;
    if(!token) {
        return res.send(401, "Unauthorized");
    }
    jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if (err || !payload.sub) {
            return res.send(401, "Unauthorized");
        }
        return next();
    })
}

function verifyRole(req, res, next) {
    const authorization = req.header('authorization');
    const token = authorization ? authorization.split('Bearer ')[1] : undefined;
    if(!token) {
        return res.send(401, "Unauthorized");
    }
    jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if (err || !payload.admin) {
            return res.send(401, "Unauthorized");
        }
        return next();
    })
}

module.exports = {signJwt, verifyJwt, verifyRole};