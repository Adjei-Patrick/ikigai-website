const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/form.db');

// Initialiser la base de données
function initializeDatabase() {
    const fs = require('fs');
    const schema = fs.readFileSync('database/schema.sql', 'utf8');
    
    console.log('Début de l\'initialisation de la base de données');
    
    db.serialize(() => {
        // Vérifier si les tables existent déjà
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='subjects'", (err, row) => {
            if (err) {
                console.error('Erreur lors de la vérification des tables:', err);
                return;
            }

            if (row) {
                console.log('Les tables existent déjà, vérification des données...');
                checkExistingData();
            } else {
                console.log('Création des tables...');
                db.exec(schema, (err) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation de la base de données:', err);
                    } else {
                        console.log('Tables créées avec succès');
                        populateDatabase();
                    }
                });
            }
        });
    });
}

function checkExistingData() {
    // Vérifier le nombre de sujets
    db.get("SELECT COUNT(*) as count FROM subjects", (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification des sujets:', err);
            return;
        }
        console.log('Nombre de sujets existants:', row.count);

        if (row.count === 0) {
            console.log('Aucun sujet trouvé, peuplement de la base de données...');
            populateDatabase();
        } else {
            // Vérifier s'il y a des doublons de sujets
            db.all(`
                SELECT name, COUNT(*) as count
                FROM subjects
                GROUP BY name
                HAVING COUNT(*) > 1
            `, (err, duplicates) => {
                if (err) {
                    console.error('Erreur lors de la vérification des doublons:', err);
                    return;
                }

                if (duplicates.length > 0) {
                    console.log('Doublons de sujets détectés:', duplicates);
                    cleanDatabase();
                    return;
                }

                // Vérifier le nombre de sections par sujet
                db.all(`
                    SELECT s.name as subject_name, COUNT(sec.id) as section_count
                    FROM subjects s
                    LEFT JOIN sections sec ON s.id = sec.subject_id
                    GROUP BY s.id
                `, (err, rows) => {
                    if (err) {
                        console.error('Erreur lors de la vérification des sections:', err);
                        return;
                    }
                    console.log('Nombre de sections par sujet:', rows);

                    // Si un sujet a plus de 5 sections, c'est qu'il y a des doublons
                    const hasDuplicates = rows.some(row => row.section_count > 5);
                    if (hasDuplicates) {
                        console.log('Trop de sections détectées, nettoyage...');
                        cleanDatabase();
                    }
                });
            });
        }
    });
}

function cleanDatabase() {
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        
        // Supprimer toutes les données
        db.run("DELETE FROM responses");
        db.run("DELETE FROM questions");
        db.run("DELETE FROM sections");
        db.run("DELETE FROM subjects");
        
        db.run("COMMIT", (err) => {
            if (err) {
                console.error('Erreur lors du nettoyage:', err);
                db.run("ROLLBACK");
            } else {
                console.log('Base de données nettoyée avec succès');
                populateDatabase();
            }
        });
    });
}

// Peupler la base de données avec les données initiales
function populateDatabase() {
    console.log('Début du peuplement de la base de données');
    
    // Vérifier si le sujet existe déjà
    db.get("SELECT id FROM subjects WHERE name = 'Développement web'", (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification du sujet:', err);
            return;
        }

        if (row) {
            console.log('Le sujet "Développement web" existe déjà, vérification des sections...');
            // Vérifier le nombre de sections pour ce sujet
            db.get("SELECT COUNT(*) as count FROM sections WHERE subject_id = ?", [row.id], (err, result) => {
                if (err) {
                    console.error('Erreur lors de la vérification des sections:', err);
                    return;
                }
                console.log('Nombre de sections existantes:', result.count);
                
                if (result.count === 5) {
                    console.log('Les 5 sections existent déjà, pas besoin de les recréer');
                    return;
                } else if (result.count > 5) {
                    console.log('Trop de sections détectées, nettoyage...');
                    cleanDatabase();
                } else {
                    console.log('Nombre incorrect de sections, nettoyage et recréation...');
                    cleanDatabase();
                }
            });
            return;
        }

        console.log('Création du sujet "Développement web"');
        // Insérer le sujet "Développement web" s'il n'existe pas
        db.run("INSERT INTO subjects (name) VALUES ('Développement web')", function(err) {
            if (err) {
                console.error('Erreur lors de l\'insertion du sujet:', err);
                return;
            }
            const subjectId = this.lastID;
            console.log('Sujet créé avec l\'ID:', subjectId);

            // Sections et questions pour le développement web
            const sections = [
                {
                    title: 'I. Compréhension Générale du Projet',
                    order: 1,
                    questions: [
                        "Quel est l'objectif principal de cette application web ? (Augmenter les ventes, améliorer la communication, automatiser des processus, etc.)",
                        "Quel est le public cible de cette application ? (Âge, profession, localisation géographique, niveau de compétence technique, etc.)",
                        "Quels sont les problèmes ou les besoins que cette application vise à résoudre pour votre entreprise ou vos utilisateurs ?",
                        "Avez-vous déjà des exemples d'applications web que vous appréciez (en termes de fonctionnalités, de design, d'expérience utilisateur) ? Quels aspects vous plaisent particulièrement ?",
                        "Avez-vous des concurrents directs ou indirects dont vous aimeriez vous inspirer ou vous différencier ?",
                        "Quel est votre budget approximatif pour ce projet ? (Cela aidera à définir la portée du projet.)",
                        "Quel est le délai souhaité pour le lancement de l'application ?",
                        "Avez-vous déjà un nom de domaine et un hébergement web ? Si oui, lesquels ?"
                    ]
                },
                // ... Ajouter les autres sections ici
                {
                    title: 'II. Fonctionnalités et Caractéristiques',
                    order: 2,
                    questions: ["Quelles sont les fonctionnalités essentielles (MVP - Minimum Viable Product) que l'application doit absolument avoir au lancement ?",
                        "Quelles sont les fonctionnalités secondaires ou agréables à avoir qui pourraient être ajoutées ultérieurement ?",
                        "Pouvez-vous décrire en détail le flux d'utilisation principal de l'application du point de vue de l'utilisateur ? (Étape par étape)",
                        "L'application nécessitera-t-elle une gestion de comptes utilisateurs (inscription, connexion, profils) ?",
                        "Y aura-t-il différents types d'utilisateurs avec des rôles et des permissions différents ?",
                        "L'application aura-t-elle besoin d'une base de données pour stocker des informations ? Quels types d'informations ?",
                        "Y a-t-il des intégrations avec d'autres systèmes ou outils que vous utilisez déjà ? (CRM, systèmes de paiement, API externes, etc.)",
                        "L'application nécessitera-t-elle des fonctionnalités spécifiques liées à la localisation (étant donné que nous sommes à Abidjan) ? (Géolocalisation, informations spécifiques à la région, etc.)",
                        "Y a-t-il des exigences spécifiques en matière de sécurité et de confidentialité des données ?"]
                },

                {
                    title: 'III. Design et Expérience Utilisateur (UX/UI) ',
                    order: 3,
                    questions: [
                        "Avez-vous déjà une charte graphique (logo, couleurs, typographie) pour votre entreprise ? Si oui, pouvez-vous la partager ?",
                        "Quel est l'aspect général que vous souhaitez pour l'application ? (Moderne, épuré, professionnel, créatif, etc.)",
                        "Y a-t-il des éléments visuels ou des styles que vous appréciez ou que vous souhaitez éviter ?",
                        "L'accessibilité web (pour les personnes handicapées) est-elle une considération importante ?"
                    ]   
                },
                
                {
                    title: 'IV. Maintenance et Évolution ',
                    order: 4,
                    questions: [ 
                        "Qui sera responsable de la maintenance et des mises à jour de l'application après son lancement ?",
                        "Prévoyez-vous d'ajouter de nouvelles fonctionnalités à l'avenir ?",
                        "Avez-vous des besoins spécifiques en matière de support technique ?"
                    ]   
                    
                },

                {
                    title: "V. Aspects Légaux et Réglementaires (Pertinent en Côte d'Ivoire) ",
                    order: 5,
                    questions: [ 
                        "Y a-t-il des réglementations locales spécifiques (en Côte d'Ivoire) à prendre en compte pour votre type d'application web (par exemple, protection des données personnelles) ?",
                        "Avez-vous des exigences en matière de mentions légales et de conditions d'utilisation ?"
                    ]   
                }
            ];

            let sectionsCreated = 0;
            sections.forEach((section, sectionIndex) => {
                console.log(`Création de la section ${sectionIndex + 1}: ${section.title}`);
                db.run("INSERT INTO sections (subject_id, title, order_num) VALUES (?, ?, ?)",
                    [subjectId, section.title, section.order],
                    function(err) {
                        if (err) {
                            console.error('Erreur lors de l\'insertion de la section:', err);
                            return;
                        }
                        const sectionId = this.lastID;
                        console.log(`Section créée avec l'ID: ${sectionId}`);

                        let questionsCreated = 0;
                        section.questions.forEach((question, questionIndex) => {
                            db.run("INSERT INTO questions (section_id, question_text, order_num) VALUES (?, ?, ?)",
                                [sectionId, question, questionIndex + 1],
                                (err) => {
                                    if (err) {
                                        console.error('Erreur lors de l\'insertion de la question:', err);
                                        return;
                                    }
                                    questionsCreated++;
                                    if (questionsCreated === section.questions.length) {
                                        console.log(`Toutes les questions de la section ${sectionIndex + 1} ont été créées`);
                                        sectionsCreated++;
                                        if (sectionsCreated === sections.length) {
                                            console.log('Toutes les sections et questions ont été créées avec succès');
                                        }
                                    }
                                });
                        });
                    });
            });
        });
    });
}

// Obtenir les données du formulaire
function getFormData(subjectName, callback) {
    console.log('Recherche des données pour le sujet:', subjectName);
    
    // D'abord, vérifier si le sujet existe
    db.get("SELECT id FROM subjects WHERE name = ?", [subjectName], (err, subject) => {
        if (err) {
            console.error('Erreur lors de la vérification du sujet:', err);
            return callback(err);
        }

        if (!subject) {
            console.log('Sujet non trouvé:', subjectName);
            return callback(null, []);
        }

        console.log('Sujet trouvé avec l\'ID:', subject.id);

        // Ensuite, vérifier le nombre de sections pour ce sujet
        db.get("SELECT COUNT(DISTINCT id) as count FROM sections WHERE subject_id = ?", [subject.id], (err, result) => {
            if (err) {
                console.error('Erreur lors de la vérification des sections:', err);
                return callback(err);
            }

            console.log('Nombre de sections distinctes:', result.count);

            if (result.count > 5) {
                console.log('Trop de sections détectées, nettoyage...');
                cleanDatabase();
                return callback(new Error('Base de données en cours de nettoyage, veuillez réessayer'));
            }

            // Récupérer les sections et questions
            db.all(`
                SELECT DISTINCT s.id as section_id, s.title as section_title, s.order_num as section_order,
                       q.id as question_id, q.question_text, q.order_num as question_order
                FROM sections s
                JOIN questions q ON s.id = q.section_id
                WHERE s.subject_id = ?
                ORDER BY s.order_num, q.order_num
            `, [subject.id], (err, rows) => {
                if (err) {
                    console.error('Erreur lors de la requête:', err);
                    return callback(err);
                }

                console.log('Nombre de lignes trouvées:', rows.length);

                const sections = {};
                rows.forEach(row => {
                    if (!sections[row.section_id]) {
                        sections[row.section_id] = {
                            id: row.section_id,
                            title: row.section_title,
                            order: row.section_order,
                            questions: []
                        };
                    }
                    sections[row.section_id].questions.push({
                        id: row.question_id,
                        text: row.question_text,
                        order: row.question_order
                    });
                });

                const result = Object.values(sections).sort((a, b) => a.order - b.order);
                console.log('Sections trouvées:', result.length);
                callback(null, result);
            });
        });
    });
}

// Sauvegarder une réponse
function saveResponse(questionId, clientEmail, responseText, callback) {
    db.run(`
        INSERT INTO responses (question_id, client_email, response_text)
        VALUES (?, ?, ?)
    `, [questionId, clientEmail, responseText], callback);
}

// Soumettre un formulaire complet
function submitForm(subjectName, clientEmail, responses, callback) {
    // Vérifier d'abord si le sujet existe
    db.get("SELECT id FROM subjects WHERE name = ?", [subjectName], (err, subject) => {
        if (err) {
            return callback(err);
        }
        if (!subject) {
            return callback(new Error('Sujet non trouvé'));
        }

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            // 1. Supprimer toutes les réponses existantes pour cet email et ce sujet
            const deleteResponses = new Promise((resolve, reject) => {
                db.run(`
                    DELETE FROM responses 
                    WHERE client_email = ? 
                    AND question_id IN (
                        SELECT q.id 
                        FROM questions q 
                        JOIN sections s ON q.section_id = s.id 
                        WHERE s.subject_id = ?
                    )
                `, [clientEmail, subject.id], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // 2. Supprimer toutes les soumissions existantes
            const deleteSubmissions = new Promise((resolve, reject) => {
                db.run(`
                    DELETE FROM form_submissions 
                    WHERE client_email = ? 
                    AND subject_id = ?
                `, [clientEmail, subject.id], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Attendre que toutes les suppressions soient terminées
            Promise.all([deleteResponses, deleteSubmissions])
                .then(() => {
                    // 3. Insérer la nouvelle soumission
                    db.run(`
                        INSERT INTO form_submissions (subject_id, client_email, submission_date)
                        VALUES (?, ?, datetime('now'))
                    `, [subject.id, clientEmail], function(err) {
                        if (err) {
                            db.run("ROLLBACK");
                            return callback(err);
                        }

                        // 4. Insérer les nouvelles réponses
                        const stmt = db.prepare(`
                            INSERT INTO responses (question_id, client_email, response_text)
                            VALUES (?, ?, ?)
                        `);

                        try {
                            responses.forEach(response => {
                                stmt.run(response.question_id, clientEmail, response.response_text);
                            });
                            stmt.finalize();
                            
                            // 5. Vérifier qu'il n'y a pas de doublons
                            db.get(`
                                SELECT COUNT(*) as count 
                                FROM responses 
                                WHERE client_email = ? 
                                AND question_id IN (
                                    SELECT q.id 
                                    FROM questions q 
                                    JOIN sections s ON q.section_id = s.id 
                                    WHERE s.subject_id = ?
                                )
                                GROUP BY question_id 
                                HAVING count > 1
                            `, [clientEmail, subject.id], (err, row) => {
                                if (err || row) {
                                    db.run("ROLLBACK");
                                    return callback(new Error('Détection de doublons dans les réponses'));
                                }
                                
                                db.run("COMMIT", callback);
                            });
                        } catch (error) {
                            stmt.finalize();
                            db.run("ROLLBACK");
                            return callback(error);
                        }
                    });
                })
                .catch(error => {
                    db.run("ROLLBACK");
                    callback(error);
                });
        });
    });
}

// Fonction pour réinitialiser la base de données
function resetDatabase(callback) {
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        
        // Supprimer toutes les données existantes
        const tables = ['responses', 'form_submissions', 'questions', 'sections', 'subjects'];
        tables.forEach(table => {
            db.run(`DELETE FROM ${table}`);
        });

        // Recréer les tables avec les nouvelles contraintes
        const schema = require('fs').readFileSync('database/schema.sql', 'utf8');
        db.exec(schema, (err) => {
            if (err) {
                console.error('Erreur lors de la réinitialisation:', err);
                db.run("ROLLBACK");
                return callback && callback(err);
            }

            // Réinitialiser les données
            db.run("COMMIT", (err) => {
                if (err) {
                    console.error('Erreur lors du commit:', err);
                    db.run("ROLLBACK");
                    return callback && callback(err);
                }
                
                // Repeupler la base de données
                populateDatabase();
                callback && callback(null);
            });
        });
    });
}

module.exports = {
    initializeDatabase,
    getFormData,
    saveResponse,
    submitForm,
    resetDatabase
}; 