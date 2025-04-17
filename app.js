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
app.get('/', (req, res) => {
    res.render('index', {
        title: 'IKIGAI - Solutions Digitales',
        services: [
            {
                title: 'Développement Web',
                description: 'Solutions web sur mesure, applications modernes et responsives',
                icon: 'web'
            },
            {
                title: 'Microsoft Dynamics NAV',
                description: 'Solutions ERP adaptées à vos besoins business',
                icon: 'business'
            },
            {
                title: 'Architecture Réseau',
                description: 'Infrastructure réseau sécurisée et performante',
                icon: 'network'
            }
        ]
    });
});

app.get('/services', (req, res) => {
    res.render('services', {
        title: 'Nos Services - IKIGAI'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'À Propos - IKIGAI'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact - IKIGAI'
    });
});

app.post('/contact', contactController.submitContact);

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Page non trouvée - IKIGAI',
        message: 'La page que vous recherchez n\'existe pas.'
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Erreur - IKIGAI',
        message: 'Une erreur est survenue sur le serveur.'
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Base de données connectée à ${process.env.DB_HOST}:${process.env.DB_PORT}`);
}); 