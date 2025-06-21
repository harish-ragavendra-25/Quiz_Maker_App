const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({ message: "Unauthorized: No token provided"});
    }

    const token = authHeader.split(" ")[1];
    try {
        const userName_Role = jwt.verify(token,process.env.JWT_SECRET);
        req.user = userName_Role;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token "});
    }
}

module.exports = verifyToken;