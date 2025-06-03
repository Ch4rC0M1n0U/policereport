# Police Report Application

Application de gestion des rapports de police avec interface web moderne.

## Déploiement avec EasyPanel et Docker

### Prérequis
- Compte GitHub avec ce repository
- Compte EasyPanel
- Docker et Docker Compose installés localement pour tests

### Configuration des variables d'environnement

Dans EasyPanel, pour le service `police-report-app`, configurez les variables d'environnement suivantes :

\`\`\`env
# Obligatoire pour la connexion à la base de données PostgreSQL gérée par EasyPanel/Docker
DATABASE_URL=postgresql://admin:password@postgres_db:5432/policereportdb # Ajustez si vous changez les identifiants dans docker-compose ou EasyPanel

# Clé API Unsplash
UNSPLASH_ACCESS_KEY=your-unsplash-access-key

# Configuration NextAuth
NEXTAUTH_SECRET=your-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-app-domain.com # Votre domaine de production

# Environnement Node
NODE_ENV=production
\`\`\`

EasyPanel gérera le service PostgreSQL. Les variables `DB_USER`, `DB_PASSWORD`, `DB_NAME` dans `docker-compose.yml` sont utilisées pour initialiser le conteneur PostgreSQL. `DATABASE_URL` est la chaîne de connexion complète que l'application Next.js utilisera.

### Étapes de déploiement sur EasyPanel

1.  **Poussez le code sur GitHub** avec tous ces fichiers.
2.  **Dans EasyPanel** :
    *   Créez un nouveau projet.
    *   Sélectionnez "GitHub" comme source et connectez votre repository.
    *   EasyPanel devrait détecter le `docker-compose.yml`.
    *   Configurez les services :
        *   **`postgres_db`** : Ce service sera créé par EasyPanel. Assurez-vous que les variables d'environnement (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) sont configurées si vous souhaitez les personnaliser au-delà des valeurs par défaut du `docker-compose.yml` (EasyPanel pourrait vous permettre de les définir directement). Le volume `postgres_data` assurera la persistance. Le fichier `schema.sql` sera utilisé pour initialiser la base de données.
        *   **`police-report-app`** :
            *   Port d'exposition : 3000
            *   Healthcheck : `/api/health`
            *   Définissez les variables d'environnement listées ci-dessus, en particulier `DATABASE_URL`, `UNSPLASH_ACCESS_KEY`, `NEXTAUTH_SECRET`, et `NEXTAUTH_URL`.

### Développement Local avec Docker

1.  Assurez-vous que Docker et Docker Compose sont installés.
2.  Créez un fichier `.env` à la racine du projet (voir l'exemple fourni).
3.  Exécutez `npm run docker:run` (ou `docker-compose up --build`).
    Ceci construira les images et démarrera les conteneurs `postgres_db` et `police-report-app`.
    La base de données sera initialisée avec `schema.sql`.
4.  Accédez à l'application sur `http://localhost:3000`.
5.  Pour arrêter les conteneurs : `npm run docker:down` (ou `docker-compose down`).

### Structure de la base de données

Le fichier `schema.sql` est utilisé pour créer les tables nécessaires. Il est automatiquement appliqué par le conteneur PostgreSQL lors de la première initialisation.

### Authentification

Utilisateur par défaut (configurable via les variables d'environnement pour PostgreSQL) :
- Username: `admin` (défini par `DB_USER` ou `POSTGRES_USER`)
- Password: `password` (défini par `DB_PASSWORD` ou `POSTGRES_PASSWORD`)

⚠️ **Important** : Changez ces identifiants en production via les configurations d'EasyPanel !

### Support

Pour toute question ou problème, consultez la documentation EasyPanel ou créez une issue sur ce repository.
\`\`\`

**Résumé des changements :**

1.  **Client PostgreSQL** : Passage de `@neondatabase/serverless` à `pg`.
2.  **Configuration Docker** : Ajout d'un service PostgreSQL dans `docker-compose.yml` avec initialisation automatique du schéma via `schema.sql` et persistance des données.
3.  **Variables d'environnement** : Mises à jour pour refléter une configuration PostgreSQL standard, avec `DATABASE_URL` comme principale variable pour la production dans EasyPanel.
4.  **Code API** : Ajustement pour la structure des résultats renvoyés par le client `pg`.
5.  **Documentation** : Mise à jour du `README.md` avec les nouvelles instructions.

Avec cette configuration, EasyPanel pourra orchestrer les deux conteneurs (votre application Next.js et la base de données PostgreSQL), et la base de données sera initialisée correctement. Assurez-vous de bien configurer les variables d'environnement dans l'interface d'EasyPanel, en particulier `DATABASE_URL` pour que votre application puisse se connecter au service PostgreSQL géré par EasyPanel.

N'oubliez pas d'installer les nouvelles dépendances :
`npm install pg`
`npm install --save-dev @types/pg`
Et de supprimer l'ancienne :
`npm uninstall @neondatabase/serverless`

Puis, commitez tous ces changements sur GitHub pour qu'EasyPanel puisse les récupérer.
