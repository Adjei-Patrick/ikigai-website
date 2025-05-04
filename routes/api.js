const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

// Route pour obtenir les données du formulaire
router.get('/form-data', (req, res) => {
    const subjectName = req.query.subject;
    console.log('Requête API reçue pour le sujet:', subjectName);
    
    if (!subjectName) {
        console.log('Erreur: sujet non spécifié');
        return res.status(400).json({ error: 'Le sujet est requis' });
    }

    formController.getFormData(subjectName, (err, sections) => {
        if (err) {
            console.error('Erreur lors de la récupération des données:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        }
        console.log('Données envoyées au client:', sections);
        res.json({ sections });
    });
});

// Route pour sauvegarder une réponse
router.post('/save-progress', (req, res) => {
    const { question_id, client_email, response_text } = req.body;
    
    if (!question_id || !client_email || !response_text) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    formController.saveResponse(question_id, client_email, response_text, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }
        res.json({ success: true });
    });
});

// Route pour soumettre le formulaire complet
router.post('/submit-form', (req, res) => {
    const { subject_name, client_email, responses } = req.body;
    
    if (!subject_name || !client_email || !responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: 'Données invalides' });
    }

    formController.submitForm(subject_name, client_email, responses, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la soumission' });
        }
        res.json({ success: true });
    });
});

// Route pour réinitialiser la base de données
router.post('/reset-database', (req, res) => {
    formController.resetDatabase((err) => {
        if (err) {
            console.error('Erreur lors de la réinitialisation:', err);
            return res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
        }
        res.json({ success: true, message: 'Base de données réinitialisée avec succès' });
    });
});

module.exports = router; 