const bcrypt = require('bcrypt');

const password = 'admin123';
bcrypt.hash(password, 10).then(hash => {
    console.log('Utilisez ces valeurs dans votre fichier .env :');
    console.log('\nADMIN_PASSWORD_HASH=' + hash);
    console.log('\nSESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'));
}); 