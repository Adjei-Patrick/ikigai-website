const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Créer le dossier database s'il n'existe pas
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// Créer la base de données
const db = new sqlite3.Database(path.join(dbDir, 'form.db'));

// Lire le schéma SQL
const schema = fs.readFileSync(path.join(dbDir, 'schema.sql'), 'utf8');

// Exécuter le schéma
db.serialize(() => {
    db.exec(schema, (err) => {
        if (err) {
            console.error('Erreur lors de l\'initialisation de la base de données:', err);
        } else {
            console.log('Base de données initialisée avec succès');
            
            // Insérer les données initiales
            const formController = require('../controllers/formController');
            formController.initializeDatabase();
        }
    });
}); 