const express = require('express');
const router = express.Router();

// Route pour la page d'accueil
router.get('/', (req, res) => {
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

// Route pour la page des services
router.get('/services', (req, res) => {
    res.render('services', {
        title: 'Nos Services - IKIGAI'
    });
});

// Route pour la page À propos
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'À Propos - IKIGAI'
    });
});

// Route pour la page de contact
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact - IKIGAI'
    });
});

// Route pour le formulaire
router.get('/form/:subject', (req, res) => {
    const subject = req.params.subject;
    res.render('form', {
        title: 'Discutons-en - IKIGAI',
        subject: subject
    });
});

module.exports = router; 