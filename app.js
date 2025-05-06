const express = require('express');
const path = require('path');
const ejs = require('ejs');
const compression = require('compression');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const { rateLimit } = require('./middleware/rateLimit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Import des routes
const mainRoutes = require('./routes/main');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const formController = require('./controllers/formController');
const { isAuthenticated } = require('./middleware/auth');

// Initialiser la base de données
formController.initializeDatabase();

// Middleware de logging pour le débogage
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.body) {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = '[HIDDEN]';
        console.log('Body:', sanitizedBody);
    }
    next();
});

// Configuration de base
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration simple pour le développement local
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });
}

app.use(express.static('public'));

// Configuration de la session
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'votre_secret_temporaire',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
};

// Ajuster la configuration des cookies en production
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Nécessaire pour Render
    sessionConfig.cookie.secure = true; // Utiliser HTTPS en production
    sessionConfig.cookie.sameSite = 'none'; // Nécessaire pour Render
}

app.use(session(sessionConfig));

// Middleware pour vérifier la session sur chaque requête
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Session:', req.session);
        console.log('Authentifié:', req.session.isAuthenticated);
    }
    next();
});

// Middleware de limitation des tentatives de connexion
app.use(rateLimit);

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuration de Helmet avec CSP personnalisé
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com"
            ],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.gstatic.com"
            ],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            formAction: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Protection de la route admin
app.use('/admin', isAuthenticated);

// Montage des routes
app.use('/', authRoutes); // Routes d'authentification en premier
app.use('/', mainRoutes);
app.use('/api', apiRoutes);

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

// Route de health check pour Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(500).json({
        success: false,
        message: 'Une erreur est survenue',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Ajout d'un message de log pour le débogage
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
    console.log(`URL: http://localhost:${port}`);
});

app.set('trust proxy', 1); // Ajout de la configuration pour Render