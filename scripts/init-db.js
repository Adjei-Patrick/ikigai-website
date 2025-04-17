require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        console.log('Lecture du script SQL...');
        const sqlScript = await fs.readFile(
            path.join(__dirname, '..', 'database', 'init.sql'),
            'utf8'
        );

        console.log('Exécution du script SQL...');
        await pool.query(sqlScript);
        
        console.log('Base de données initialisée avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

initializeDatabase().catch(console.error); 