const loginAttempts = new Map();

const rateLimit = (req, res, next) => {
    const ip = req.ip;
    const maxAttempts = process.env.MAX_LOGIN_ATTEMPTS || 5;
    const timeoutMinutes = process.env.LOGIN_TIMEOUT_MINUTES || 15;
    
    if (req.path === '/login' && req.method === 'POST') {
        const userAttempts = loginAttempts.get(ip) || { count: 0, timestamp: Date.now() };
        
        // Réinitialiser le compteur si le délai est passé
        if (Date.now() - userAttempts.timestamp > timeoutMinutes * 60 * 1000) {
            userAttempts.count = 0;
            userAttempts.timestamp = Date.now();
        }
        
        // Vérifier si l'utilisateur a dépassé le nombre maximum de tentatives
        if (userAttempts.count >= maxAttempts) {
            const timeLeft = Math.ceil((timeoutMinutes * 60 * 1000 - (Date.now() - userAttempts.timestamp)) / 60000);
            return res.render('login', {
                title: 'Connexion - IKIGAI',
                error: `Trop de tentatives. Veuillez réessayer dans ${timeLeft} minutes.`
            });
        }
        
        // Incrémenter le compteur
        userAttempts.count++;
        loginAttempts.set(ip, userAttempts);
    }
    
    next();
};

// Fonction pour réinitialiser les tentatives après une connexion réussie
const resetLoginAttempts = (ip) => {
    loginAttempts.delete(ip);
};

module.exports = {
    rateLimit,
    resetLoginAttempts
}; 