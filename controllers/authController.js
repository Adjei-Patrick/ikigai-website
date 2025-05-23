const bcrypt = require('bcrypt');
const { resetLoginAttempts } = require('../middleware/rateLimit');

// Ces identifiants devraient être stockés de manière sécurisée (variables d'environnement, base de données, etc.)
const ADMIN_USERNAME = 'admin';
// Le mot de passe haché correspond au nouveau mot de passe sécurisé
const ADMIN_PASSWORD_HASH = '$2b$10$q4hsZd07nFzkS2EIhyAsLOatAkQAkY3EziMPQRmtat.K08cjEQVdq';

const login = async (req, res) => {
    const { username, password } = req.body;
    const isAjax = req.xhr || req.headers.accept.includes('application/json');
    
    console.log('=== Tentative de connexion ===');
    console.log('Type de requête:', isAjax ? 'AJAX' : 'Normal');
    console.log('Username reçu:', username);

    try {
        // Vérifier le nom d'utilisateur
        if (username !== ADMIN_USERNAME) {
            console.log('Échec: nom d\'utilisateur incorrect');
            return isAjax
                ? res.status(401).json({ success: false, message: 'Identifiants invalides' })
                : res.render('login', { title: 'Connexion - IKIGAI', error: 'Identifiants invalides' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        console.log('Validation du mot de passe:', isPasswordValid);
        
        if (!isPasswordValid) {
            console.log('Échec: mot de passe incorrect');
            return isAjax
                ? res.status(401).json({ success: false, message: 'Identifiants invalides' })
                : res.render('login', { title: 'Connexion - IKIGAI', error: 'Identifiants invalides' });
        }

        console.log('Connexion réussie !');
        resetLoginAttempts(req.ip);

        // Créer la session
        req.session.isAuthenticated = true;
        req.session.username = username;
        req.session.lastActivity = Date.now();

        // Répondre selon le type de requête
        if (isAjax) {
            res.json({ success: true, redirect: '/admin' });
        } else {
            res.redirect('/admin');
        }

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return isAjax
            ? res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' })
            : res.render('login', { title: 'Connexion - IKIGAI', error: 'Une erreur est survenue lors de la connexion' });
    }
};

const logout = (req, res) => {
    // Détruire la session
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
        res.redirect('/login');
    });
};

const showLoginPage = (req, res) => {
    // Si déjà authentifié, rediriger vers la page admin
    if (req.session && req.session.isAuthenticated) {
        return res.redirect('/admin');
    }
    
    res.render('login', {
        title: 'Connexion - IKIGAI'
    });
};

module.exports = {
    login,
    logout,
    showLoginPage
}; 