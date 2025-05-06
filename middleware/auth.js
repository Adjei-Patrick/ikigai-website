const isAuthenticated = (req, res, next) => {
    console.log('Vérification d\'authentification');
    console.log('Session:', req.session);
    console.log('isAuthenticated:', req.session?.isAuthenticated);

    if (!req.session) {
        console.log('Pas de session trouvée');
        return res.redirect('/login');
    }

    if (!req.session.isAuthenticated) {
        console.log('Session non authentifiée');
        return res.redirect('/login');
    }

    console.log('Utilisateur authentifié:', req.session.username);
    next();
};

module.exports = {
    isAuthenticated
}; 