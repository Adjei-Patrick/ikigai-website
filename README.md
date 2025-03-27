# Site Web IKIGAI

Site web professionnel pour IKIGAI, une entreprise spécialisée dans le développement web, les solutions ERP Microsoft Dynamics NAV et l'architecture réseau.

## Technologies Utilisées

- Node.js
- Express.js
- EJS (Template Engine)
- Axios (Client HTTP)
- HTML5
- CSS3
- JavaScript (Vanilla)

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

## Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd ikigai-website
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet :
```bash
PORT=3000
```

## Démarrage

Pour lancer le serveur en mode développement :
```bash
npm run dev
```

Pour lancer le serveur en mode production :
```bash
npm start
```

Le site sera accessible à l'adresse : `http://localhost:3000`

## Structure du Projet

```
ikigai-website/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── views/
│   ├── layout.ejs
│   ├── index.ejs
│   ├── services.ejs
│   ├── about.ejs
│   └── contact.ejs
├── app.js
├── package.json
└── README.md
```

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