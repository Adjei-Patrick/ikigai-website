const bcrypt = require('bcrypt');
const { resetLoginAttempts } = require('../middleware/rateLimit');

// Ces identifiants devraient être stockés de manière sécurisée (variables d'environnement, base de données, etc.)
const ADMIN_USERNAME = 'admin';
// Le mot de passe haché correspond au nouveau mot de passe sécurisé
const ADMIN_PASSWORD_HASH = '$2b$10$q4hsZd07nFzkS2EIhyAsLOatAkQAkY3EziMPQRmtat.K08cjEQVdq';

const login = async (req, res) => {
    const { username, password } = req.body;
    
    // Debug logs améliorés
    console.log('=== Tentative de connexion ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Session Secret configuré:', !!process.env.SESSION_SECRET);
    console.log('Username reçu:', username);
    console.log('Username attendu:', ADMIN_USERNAME);
    console.log('Password reçu (longueur):', password ? password.length : 0);
    console.log('Session actuelle:', req.session);
    console.log('Cookies:', req.headers.cookie);

    try {
        // Vérifier si les identifiants sont corrects
        if (username !== ADMIN_USERNAME) {
            console.log('Échec: nom d\'utilisateur incorrect');
            return res.render('login', {
                title: 'Connexion - IKIGAI',
                error: 'Identifiants invalides'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        console.log('Résultat de la comparaison du mot de passe:', isPasswordValid);
        
        if (!isPasswordValid) {
            console.log('Échec: mot de passe incorrect');
            return res.render('login', {
                title: 'Connexion - IKIGAI',
                error: 'Identifiants invalides'
            });
        }

        console.log('Connexion réussie !');

        // Réinitialiser les tentatives de connexion
        resetLoginAttempts(req.ip);

        // Créer la session
        req.session.isAuthenticated = true;
        req.session.username = username;
        req.session.lastActivity = Date.now();

        console.log('Session après authentification:', req.session);

        // Rediriger vers la page d'administration
        res.redirect('/admin');

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.render('login', {
            title: 'Connexion - IKIGAI',
            error: 'Une erreur est survenue lors de la connexion'
        });
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