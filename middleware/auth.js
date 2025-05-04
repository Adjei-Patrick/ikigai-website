const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    isAuthenticated
}; 