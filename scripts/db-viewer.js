const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, '../database/form.db');

// Connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err.message);
        return;
    }
    console.log('Connecté à la base de données SQLite.');

    // Afficher toutes les tables
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error('Erreur lors de la récupération des tables:', err.message);
            return;
        }
        
        console.log('\nTables dans la base de données:');
        tables.forEach(table => {
            console.log(`- ${table.name}`);
            
            // Afficher le contenu de chaque table
            db.all(`SELECT * FROM ${table.name}`, [], (err, rows) => {
                if (err) {
                    console.error(`Erreur lors de la récupération des données de ${table.name}:`, err.message);
                    return;
                }
                
                console.log(`\nContenu de la table ${table.name}:`);
                console.table(rows);
            });
        });
    });
});

// Fermer la connexion quand on a terminé
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la base de données:', err.message);
        } else {
            console.log('Connexion à la base de données fermée.');
        }
    });
}); 