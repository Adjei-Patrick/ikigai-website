# IKIGAI Website

Site web professionnel d'IKIGAI - Services de développement web, solutions ERP et architecture réseau.

## Configuration du Déploiement

### Prérequis
- Node.js v14 ou supérieur
- NPM v6 ou supérieur
- Compte Render.com

### Variables d'Environnement
Configurez les variables suivantes dans le dashboard Render :

```env
NODE_ENV=production
PORT=10000
SESSION_SECRET=[généré automatiquement]
```

### Base de Données
La base de données SQLite est stockée dans un volume persistant sur Render.
Chemin en production : `/opt/render/project/src/database/form.db`

### Sécurité
- HTTPS activé par défaut
- Sessions sécurisées
- Protection CSRF
- Headers de sécurité via Helmet

### Déploiement
1. Connectez votre repo GitHub à Render
2. Créez un nouveau Web Service
3. Sélectionnez la branche à déployer
4. Les variables d'environnement sont configurées dans `render.yaml`

### Maintenance
- Les logs sont disponibles dans le dashboard Render
- Surveillance de l'état via `/health`
- Redémarrage automatique en cas de crash

### Développement Local
```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Démarrage en mode production
npm start
```

## Structure du Projet
```
├── app.js              # Point d'entrée de l'application
├── routes/            # Routes de l'application
├── controllers/       # Logique métier
├── middleware/        # Middlewares personnalisés
├── views/            # Templates EJS
├── public/           # Fichiers statiques
└── database/         # Base de données SQLite
```

## Technologies Utilisées

- Node.js
- Express.js
- EJS (Template Engine)
- Axios (Client HTTP)
- HTML5
- CSS3
- JavaScript (Vanilla)

## Fonctionnalités

- Design responsive
- Animations fluides
- Menu mobile
- Sections de services
- Formulaire de contact
- Intégration des réseaux sociaux

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 