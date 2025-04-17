require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const contactController = require('./controllers/contactController');

const app = express();

// Configuration du middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/contact', contactController.submitContact);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Une erreur est survenue sur le serveur.'
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Base de données connectée à ${process.env.DB_HOST}:${process.env.DB_PORT}`);
}); 