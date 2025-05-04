const bcrypt = require('bcrypt');

// Votre mot de passe personnalisé ici
const customPassword = 'admin@230103#';

// Générer le hash
bcrypt.hash(customPassword, 10).then(hash => {
    console.log('\n=== Nouveaux identifiants sécurisés ===');
    console.log('\nNom d\'utilisateur: admin');
    console.log('Mot de passe:', customPassword);
    console.log('\nHash à mettre dans authController.js:');
    console.log(hash);
    console.log('\n===================================');
}); 