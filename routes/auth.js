const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, '../database/form.db');

// Route pour afficher la page de connexion
router.get('/login', authController.showLoginPage);

// Route pour traiter la connexion
router.post('/login', authController.login);

// Route pour la déconnexion (protégée)
router.get('/logout', isAuthenticated, authController.logout);

// Route pour la page d'administration (protégée)
router.get('/admin', isAuthenticated, async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    
    try {
        // Récupérer toutes les soumissions avec leurs réponses
        const submissions = await new Promise((resolve, reject) => {
            db.all(`
                SELECT DISTINCT 
                    fs.id as submission_id,
                    fs.client_email,
                    fs.submission_date,
                    s.name as subject_name,
                    sec.title as section_title,
                    q.question_text,
                    r.response_text
                FROM form_submissions fs
                JOIN subjects s ON fs.subject_id = s.id
                JOIN responses r ON r.client_email = fs.client_email
                JOIN questions q ON r.question_id = q.id
                JOIN sections sec ON q.section_id = sec.id
                ORDER BY fs.submission_date DESC, sec.order_num, q.order_num
            `, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        // Organiser les données par soumission
        const organizedSubmissions = {};
        submissions.forEach(row => {
            if (!organizedSubmissions[row.submission_id]) {
                organizedSubmissions[row.submission_id] = {
                    id: row.submission_id,
                    client_email: row.client_email,
                    subject_name: row.subject_name,
                    submission_date: row.submission_date,
                    sections: {}
                };
            }
            
            if (!organizedSubmissions[row.submission_id].sections[row.section_title]) {
                organizedSubmissions[row.submission_id].sections[row.section_title] = [];
            }
            
            organizedSubmissions[row.submission_id].sections[row.section_title].push({
                question: row.question_text,
                response: row.response_text
            });
        });

        res.render('admin', {
            title: 'Administration',
            submissions: Object.values(organizedSubmissions)
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).send('Erreur lors de la récupération des données');
    } finally {
        db.close();
    }
});

module.exports = router; 