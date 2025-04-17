const db = require('../config/database');

exports.submitContact = async (req, res) => {
    const client = await db.query('BEGIN');

    try {
        // Insertion dans la table contacts
        const contactResult = await db.query(
            'INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.body.name, req.body.email, req.body.subject, req.body.message]
        );

        const contactId = contactResult.rows[0].id;

        // Si c'est un projet web, insérer le questionnaire
        if (req.body.subject === 'web') {
            await db.query(
                `INSERT INTO web_questionnaires (
                    contact_id, project_objective, target_audience, project_needs,
                    inspiration, domain_hosting, mvp_features, secondary_features,
                    tech_features, security_requirements, visual_style, design_needs,
                    maintenance, future_evolution, legal_requirements, budget, deadline
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
                [
                    contactId,
                    req.body.project_objective,
                    req.body.target_audience,
                    req.body.project_needs,
                    req.body.inspiration,
                    req.body.domain_hosting,
                    req.body.mvp_features,
                    req.body.secondary_features,
                    req.body.tech_features || [],
                    req.body.security_requirements,
                    req.body.visual_style || [],
                    req.body.design_needs || [],
                    req.body.maintenance,
                    req.body.future_evolution,
                    req.body.legal_requirements,
                    req.body.budget,
                    req.body.deadline
                ]
            );
        }

        await db.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Votre message a été envoyé avec succès!'
        });

    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Erreur lors de la soumission du formulaire:', error);
        
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors de l\'envoi du message.'
        });
    }
}; 