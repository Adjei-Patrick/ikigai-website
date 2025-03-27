const express = require('express');
const path = require('path');
const ejs = require('ejs');
const compression = require('compression');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

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

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Erreur - IKIGAI',
        message: 'Une erreur est survenue'
    });
});

// Ajout d'un message de log pour le débogage
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
    console.log(`URL: http://localhost:${port}`);
}); 