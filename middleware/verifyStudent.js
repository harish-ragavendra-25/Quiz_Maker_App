const verifyStudent = (req,res,next) => {
    if(req.user.role !== 'student'){
        return res.status(403).json({ message: 'Access denied: Students Only'});
    }
    next();
}

module.exports = verifyStudent;