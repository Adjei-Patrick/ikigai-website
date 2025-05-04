const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Supprimer la base de données existante
const dbPath = path.join(__dirname, '..', 'database', 'form.db');
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Base de données existante supprimée');
}

// Créer une nouvelle base de données
const db = new sqlite3.Database(dbPath);

// Lire et exécuter le schéma
const schema = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');

db.serialize(() => {
    // Exécuter le schéma
    db.exec(schema, (err) => {
        if (err) {
            console.error('Erreur lors de la création des tables:', err);
            process.exit(1);
        }
        console.log('Schéma de base de données créé avec succès');
        
        // Fermer la connexion
        db.close((err) => {
            if (err) {
                console.error('Erreur lors de la fermeture de la base de données:', err);
                process.exit(1);
            }
            console.log('Base de données réinitialisée avec succès');
            process.exit(0);
        });
    });
}); 