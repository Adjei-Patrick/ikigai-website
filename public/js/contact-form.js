document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si nous sommes sur la page du formulaire
    const formContainer = document.getElementById('dynamic-form-container');
    if (!formContainer) {
        return; // Quitter si nous ne sommes pas sur la page du formulaire
    }

    // Récupérer le sujet depuis l'URL plutôt que du texte
    const urlParams = new URLSearchParams(window.location.search);
    const subject = decodeURIComponent(window.location.pathname.split('/').pop());

    if (subject) {
        console.log('Sujet:', subject);
        loadFormData(subject);
    }
});

async function loadFormData(subject) {
    try {
        console.log('Tentative de chargement du formulaire...');
        const response = await fetch(`/api/form-data?subject=${encodeURIComponent(subject)}`);
        console.log('Réponse reçue:', response.status);
        const data = await response.json();
        console.log('Données reçues:', data);
        
        if (data.sections) {
            console.log('Création du formulaire avec', data.sections.length, 'sections');
            createForm(data.sections);
        } else {
            console.log('Aucune section trouvée dans la réponse');
        }
    } catch (error) {
        console.error('Erreur lors du chargement du formulaire:', error);
    }
}

function createForm(sections) {
    const formContainer = document.getElementById('dynamic-form-container');
    let formHTML = `
        <section class="contact-page">
            <div class="contact-form-container" style="margin: 0 auto; max-width: 800px;">
                <form id="web-dev-form" class="web-dev-form">
                    <div class="form-group email-group mb-4">
                        <label for="client-email">Votre adresse email :</label>
                        <input type="email" id="client-email" name="client-email" required class="form-control">
                    </div>
    `;

    sections.forEach(section => {
        if (section.questions && section.questions.length > 0) {
            formHTML += `
                <div class="form-section mb-4" data-section-id="${section.id}">
                    <h3 class="section-title mb-3">${section.title}</h3>
            `;

            section.questions.forEach(question => {
                formHTML += `
                    <div class="question-group form-group mb-4" data-question-id="${question.id}">
                        <label for="question-${question.id}">${question.text}</label>
                        <textarea id="question-${question.id}" name="question-${question.id}" rows="4" required class="form-control"></textarea>
                    </div>
                `;
            });

            formHTML += `</div>`;
        }
    });

    formHTML += `
                    <div class="form-actions text-center mt-4">
                        <button type="submit" class="btn btn-primary submit-btn">Envoyer</button>
                    </div>
                </form>
            </div>
        </section>
    `;

    formContainer.innerHTML = formHTML;

    // Ajouter les écouteurs d'événements pour le formulaire
    setupFormEventListeners();
}

function setupFormEventListeners() {
    // Sauvegarde automatique des réponses
    document.addEventListener('input', debounce(function(e) {
        if (e.target.matches('textarea')) {
            const questionId = e.target.id.split('-')[1];
            const clientEmail = document.getElementById('client-email').value;
            
            if (clientEmail) {
                fetch('/api/save-progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        question_id: questionId,
                        client_email: clientEmail,
                        response_text: e.target.value
                    })
                });
            }
        }
    }, 1000));

    // Gestion de la soumission du formulaire
    const form = document.getElementById('web-dev-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const clientEmail = formData.get('client-email');
    const subject = decodeURIComponent(window.location.pathname.split('/').pop());
    const responses = [];

    e.target.querySelectorAll('.question-group').forEach(group => {
        const questionId = group.dataset.questionId;
        const response = formData.get(`question-${questionId}`);
        if (response) {
            responses.push({
                question_id: questionId,
                response_text: response
            });
        }
    });

    try {
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject_name: subject,
                client_email: clientEmail,
                responses: responses
            })
        });

        if (response.ok) {
            alert('Formulaire envoyé avec succès !');
            // Rediriger vers la page de contact après une soumission réussie
            window.location.href = '/contact';
        } else {
            throw new Error('Erreur lors de l\'envoi du formulaire');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'envoi du formulaire');
    }
}

// Fonction pour debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 