================================================================================
BLOG API - APPLICATION DE BLOG AVEC NODE.JS ET SQLITE
================================================================================

Une application de blog complète avec une API RESTful et une interface utilisateur moderne permettant de gérer des articles de blog avec des fonctionnalités de création, lecture, modification, suppression, recherche et filtrage.

================================================================================
FONCTIONNALITÉS
================================================================================

BACKEND (API) :
- CRUD complet pour les articles (Créer, Lire, Modifier, Supprimer)
- Recherche d'articles par mots-clés dans titre, contenu, auteur et catégorie
- Filtrage par catégorie et auteur
- Base de données SQLite (fichier unique, sans serveur)
- Validation des données
- Gestion des erreurs
- Logging des requêtes HTTP avec Morgan
- Architecture RESTful

FRONTEND (INTERFACE UTILISATEUR) :
- Interface responsive et moderne
- Création et édition d'articles
- Suppression avec confirmation
- Filtrage en temps réel par auteur et catégorie
- Recherche instantanée
- Affichage des tags
- Pagination automatique
- Design épuré et intuitif

================================================================================
TECHNOLOGIES UTILISÉES
================================================================================

BACKEND :
- Node.js - Runtime JavaScript
- Express.js - Framework web
- SQLite3 - Base de données légère
- SQLite - Interface pour SQLite
- CORS - Gestion des requêtes cross-origin
- Morgan - Logging HTTP
- Dotenv - Gestion des variables d'environnement

FRONTEND :
- HTML5 - Structure
- CSS3 - Styles et animations
- JavaScript (ES6+) - Interactivité et appels API

================================================================================
PRÉREQUIS
================================================================================

Avant de commencer, assurez-vous d'avoir installé :

- Node.js (version 14 ou supérieure)
- npm (gestionnaire de paquets Node.js)

Vérifiez les versions avec les commandes :
node --version
npm --version

================================================================================
INSTALLATION ET DÉMARRAGE
================================================================================

ÉTAPE 1 - CRÉER LE DOSSIER DU PROJET :
mkdir blog-api
cd blog-api

ÉTAPE 2 - INITIALISER LE PROJET NODE.JS :
npm init -y

ÉTAPE 3 - INSTALLER LES DÉPENDANCES :
npm install express sqlite3 sqlite cors morgan dotenv
npm install --save-dev nodemon

ÉTAPE 4 - CRÉER LE FICHIER SERVER.JS :
Créez un fichier server.js à la racine du projet et copiez-y le code du serveur fourni.

ÉTAPE 5 - CRÉER LE FICHIER INDEX.HTML :
Créez un fichier index.html à la racine du projet et copiez-y le code frontend fourni.

ÉTAPE 6 - CRÉER LE FICHIER .ENV (OPTIONNEL) :
Créez un fichier .env à la racine du projet avec le contenu suivant :
PORT=3000
DB_PATH=./blog.db
NODE_ENV=development

ÉTAPE 7 - CONFIGURER PACKAGE.JSON :
Modifiez la section "scripts" dans package.json :
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

ÉTAPE 8 - DÉMARRER L'APPLICATION :
Mode développement (avec rechargement automatique) :
npm run dev

Mode production :
npm start

ÉTAPE 9 - ACCÉDER À L'APPLICATION :
Ouvrez votre navigateur et allez à : http://localhost:3000

================================================================================
STRUCTURE DU PROJET
================================================================================

blog-api/
├── server.js              # Serveur Node.js avec l'API
├── index.html             # Interface utilisateur frontend
├── package.json           # Dépendances et scripts
├── package-lock.json      # Verrouillage des versions
├── .env                   # Variables d'environnement
├── blog.db                # Base de données SQLite (créée automatiquement)
└── README.md              # Documentation

================================================================================
DOCUMENTATION DE L'API
================================================================================

ENDPOINTS DISPONIBLES :

Méthode | Endpoint                    | Description
--------|-----------------------------|------------------------------------------
GET     | /                           | Page d'accueil (frontend)
POST    | /api/articles               | Créer un article
GET     | /api/articles               | Lister tous les articles
GET     | /api/articles/:id           | Obtenir un article par ID
PUT     | /api/articles/:id           | Modifier un article
DELETE  | /api/articles/:id           | Supprimer un article
GET     | /api/articles/search?query= | Rechercher des articles

================================================================================
EXEMPLES D'UTILISATION DE L'API AVEC CURL
================================================================================

1. CRÉER UN ARTICLE :
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon premier article",
    "content": "Ceci est le contenu de mon article",
    "author": "Jean Dupont",
    "date": "2026-03-23",
    "category": "Technologie",
    "tags": ["nodejs", "sqlite", "api"]
  }'

2. RÉCUPÉRER TOUS LES ARTICLES :
curl http://localhost:3000/api/articles

3. FILTRER PAR CATÉGORIE :
curl "http://localhost:3000/api/articles?category=Technologie"

4. FILTRER PAR AUTEUR :
curl "http://localhost:3000/api/articles?author=Jean"

5. RÉCUPÉRER UN ARTICLE PAR ID :
curl http://localhost:3000/api/articles/1

6. RECHERCHER DES ARTICLES :
curl "http://localhost:3000/api/articles/search?query=nodejs"

7. MODIFIER UN ARTICLE :
curl -X PUT http://localhost:3000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouveau titre modifié"
  }'

8. SUPPRIMER UN ARTICLE :
curl -X DELETE http://localhost:3000/api/articles/1

================================================================================
STRUCTURE DE LA BASE DE DONNÉES
================================================================================

TABLE "articles" :

| Colonne     | Type           | Description                          |
|-------------|----------------|--------------------------------------|
| id          | INTEGER        | Identifiant unique (clé primaire)   |
| title       | VARCHAR(255)   | Titre de l'article                   |
| content     | TEXT           | Contenu de l'article                 |
| author      | VARCHAR(100)   | Nom de l'auteur                      |
| date        | DATE           | Date de publication                  |
| category    | VARCHAR(100)   | Catégorie de l'article               |
| tags        | TEXT           | Tags au format JSON                  |
| created_at  | TIMESTAMP      | Date de création                     |

INDEX CRÉÉS :
- idx_category : pour accélérer les filtres par catégorie
- idx_author : pour accélérer les filtres par auteur
- idx_date : pour accélérer le tri par date

================================================================================
CARACTÉRISTIQUES DE L'INTERFACE UTILISATEUR
================================================================================

FORMULAIRE DE CRÉATION/ÉDITION :
- Titre de l'article
- Contenu (zone de texte)
- Auteur
- Date de publication
- Catégorie (sélection)
- Tags (séparés par des virgules)

FILTRES ET RECHERCHE :
- Filtrer par auteur (saisie en temps réel)
- Filtrer par catégorie (liste déroulante)
- Recherche textuelle dans tous les articles
- Bouton de réinitialisation des filtres

LISTE DES ARTICLES :
- Affichage sous forme de cartes
- Titre, auteur, date, catégorie
- Extrait du contenu (300 caractères max)
- Tags sous forme de badges
- Boutons Modifier et Supprimer

MODAL DE CONFIRMATION :
- Confirmation avant suppression
- Affichage du titre de l'article

================================================================================
DÉPENDANCES NPM
================================================================================

DÉPENDANCES PRINCIPALES :
express@4.18.2              - Framework web pour Node.js
sqlite3@5.1.6               - Pilote SQLite pour Node.js
sqlite@5.1.1                - Interface SQLite moderne
cors@2.8.5                  - Middleware CORS
morgan@1.10.0               - Logger HTTP
dotenv@16.0.3               - Gestion des variables d'environnement

DÉPENDANCES DE DÉVELOPPEMENT :
nodemon@2.0.22              - Rechargement automatique du serveur

================================================================================
RÉSOLUTION DES PROBLÈMES COURANTS
================================================================================

ERREUR : "Cannot find module 'express'"
SOLUTION : Exécutez npm install pour installer toutes les dépendances

ERREUR : "SQLITE_ERROR: no such table: articles"
SOLUTION : Le serveur crée automatiquement la table au démarrage. Vérifiez que la création s'est bien passée dans les logs.

ERREUR : "EADDRINUSE: address already in use :::3000"
SOLUTION : Le port 3000 est déjà utilisé. Changez le port dans le fichier .env ou arrêtez l'autre application.

ERREUR : Impossible de se connecter à l'API
SOLUTION : Vérifiez que le serveur est démarré (node server.js) et que le port 3000 est accessible.

L'API répond avec "404 Not Found"
SOLUTION : Vérifiez que les routes sont correctement définies dans server.js et que vous utilisez les bonnes URLs.

================================================================================
COMMANDES UTILES
================================================================================

Démarrer le serveur en production :
npm start

Démarrer le serveur en développement (avec rechargement auto) :
npm run dev

Installer toutes les dépendances :
npm install

Voir les logs du serveur :
Les logs s'affichent directement dans le terminal

Supprimer la base de données (pour repartir de zéro) :
rm blog.db
Puis redémarrez le serveur qui recréera la base automatiquement

================================================================================
BONNES PRATIQUES
================================================================================

SÉCURITÉ :
- Les requêtes préparées sont utilisées pour éviter les injections SQL
- Les données sont validées avant insertion
- Les erreurs sont gérées proprement sans exposer les détails internes

PERFORMANCES :
- Indexes SQL pour accélérer les recherches
- Pagination pour éviter de charger trop de données
- Fichier de base de données unique pour des performances optimales

MAINTENABILITÉ :
- Code commenté et structuré
- Séparation claire entre les routes
- Gestion des erreurs centralisée
- Variables d'environnement pour la configuration

================================================================================
LICENCE
================================================================================

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, de le modifier et de le distribuer.

================================================================================
CONTACT ET SUPPORT
================================================================================

Pour toute question ou suggestion, n'hésitez pas à :
- Créer une issue sur le dépôt du projet
- Contacter l'administrateur

================================================================================
REMERCIEMENTS
================================================================================

Merci d'utiliser cette application ! N'hésitez pas à la personnaliser selon vos besoins.

================================================================================
VERSION
================================================================================

Version 1.0.0 - Mars 2026

================================================================================
