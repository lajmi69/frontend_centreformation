# Centre Formation - Frontend React

Application frontend SPA (Single Page Application) pour le système de gestion du Centre de Formation.

## Technologies utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool rapide
- **React Router 6** - Routing
- **React Bootstrap** - Composants UI
- **Axios** - Requêtes HTTP
- **React Toastify** - Notifications

## Structure du projet

```
frontend/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Layout.jsx     # Layout principal avec sidebar
│   │   └── PrivateRoute.jsx # Protection des routes
│   ├── context/
│   │   └── AuthContext.jsx # Contexte d'authentification
│   ├── pages/             # Pages de l'application
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Etudiants.jsx
│   │   ├── Formateurs.jsx
│   │   ├── Cours.jsx
│   │   ├── Inscriptions.jsx
│   │   └── Notes.jsx
│   ├── services/          # Services API
│   │   ├── api.js         # Configuration Axios
│   │   ├── AuthService.js
│   │   ├── EtudiantService.js
│   │   ├── FormateurService.js
│   │   ├── CoursService.js
│   │   ├── InscriptionService.js
│   │   ├── NoteService.js
│   │   └── StatistiquesService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

## Installation

```bash
# Installer les dépendances
npm install
```

## Lancement

```bash
# Mode développement (avec hot reload)
npm run dev

# L'application sera disponible sur http://localhost:3000
```

## Build pour production

```bash
npm run build
```

## Configuration

Le proxy Vite est configuré pour rediriger les appels `/api/*` vers le backend Spring Boot sur `http://localhost:8080`.

## Fonctionnalités

### Authentification
- Login avec JWT
- Register (inscription)
- Gestion du token automatique
- Protection des routes

### Profil utilisateur
- Affichage du profil
- Modification des informations
- Changement de mot de passe

### Gestion (selon les rôles)
- **Admin** : Accès complet à toutes les fonctionnalités
- **Formateur** : Gestion des cours, notes, inscriptions
- **Étudiant** : Consultation des cours et notes

## API Endpoints utilisés

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/login` | POST | Connexion |
| `/api/auth/register` | POST | Inscription |
| `/api/profile` | GET | Récupérer le profil |
| `/api/profile` | PUT | Modifier le profil |
| `/api/profile/password` | PUT | Changer le mot de passe |
| `/api/etudiants` | CRUD | Gestion des étudiants |
| `/api/formateurs` | CRUD | Gestion des formateurs |
| `/api/cours` | CRUD | Gestion des cours |
| `/api/inscriptions` | CRUD | Gestion des inscriptions |
| `/api/notes` | CRUD | Gestion des notes |
| `/api/statistiques/*` | GET | Statistiques |


