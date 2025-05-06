document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                console.log('Tentative de connexion...');
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include', // Important pour la production
                    body: JSON.stringify({ username, password })
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || `Erreur ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Connexion réussie');
                
                // Redirection avec un petit délai pour assurer que la session est bien établie
                setTimeout(() => {
                    window.location.replace(data.redirect || '/admin');
                }, 100);
                
            } catch (error) {
                console.error('Erreur:', error);
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger';
                errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Erreur de connexion au serveur'}`;
                
                // Supprimer les anciens messages d'erreur
                const oldError = loginForm.querySelector('.alert');
                if (oldError) {
                    oldError.remove();
                }
                
                loginForm.insertBefore(errorDiv, loginForm.firstChild);
            }
        });
    }
}); 