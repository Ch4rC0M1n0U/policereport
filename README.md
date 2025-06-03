# Police Report Application

Application de gestion des rapports de police avec interface web moderne.

## Déploiement avec EasyPanel

### Prérequis
- Compte GitHub avec ce repository
- Compte EasyPanel
- Base de données Neon configurée
- Clé API Unsplash

### Configuration des variables d'environnement

Dans EasyPanel, configurez les variables d'environnement suivantes :

\`\`\`env
NEON_DATABASE_URL=postgresql://your-neon-connection-string
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
NEXTAUTH_SECRET=your-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
\`\`\`

### Étapes de déploiement

1. **Connecter le repository GitHub**
   - Dans EasyPanel, créez une nouvelle application
   - Sélectionnez "GitHub" comme source
   - Connectez ce repository

2. **Configuration du build**
   - EasyPanel détectera automatiquement le Dockerfile
   - Port d'exposition : 3000
   - Healthcheck : `/api/health`

3. **Variables d'environnement**
   - Ajoutez toutes les variables listées ci-dessus
   - Générez un NEXTAUTH_SECRET sécurisé (32+ caractères)
   - Mettez à jour NEXTAUTH_URL avec votre domaine

4. **Base de données**
   - Assurez-vous que votre base de données Neon est accessible
   - Exécutez le script SQL de création des tables si nécessaire

### Scripts disponibles

- `npm run dev` - Développement local
- `npm run build` - Build de production
- `npm run start` - Démarrage en production
- `npm run docker:build` - Build de l'image Docker
- `npm run docker:run` - Exécution locale avec Docker

### Structure de la base de données

Exécutez le script `schema.sql` pour créer les tables nécessaires dans votre base de données Neon.

### Authentification

Utilisateur par défaut :
- Username: `admin`
- Password: `password`

⚠️ **Important** : Changez ces identifiants en production !

### Support

Pour toute question ou problème, consultez la documentation EasyPanel ou créez une issue sur ce repository.
