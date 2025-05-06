document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Empêche le rechargement de la page
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Redirection vers la page admin en cas de succès
                    window.location.href = '/admin';
                } else {
                    // Affichage de l'erreur
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'alert alert-danger';
                    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.message || 'Erreur de connexion'}`;
                    
                    // Insérer le message d'erreur au début du formulaire
                    loginForm.insertBefore(errorDiv, loginForm.firstChild);
                }
            } catch (error) {
                console.error('Erreur:', error);
                // Affichage d'une erreur générique
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger';
                errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Une erreur est survenue';
                loginForm.insertBefore(errorDiv, loginForm.firstChild);
            }
        });
    }
}); 