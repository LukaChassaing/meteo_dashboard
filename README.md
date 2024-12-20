# Meteo Dashboard

Une application web Angular moderne pour visualiser et analyser les données météorologiques intérieures et extérieures, avec un affichage en temps réel des températures et de l'humidité.

## Fonctionnalités

- 📊 Visualisation des données météo avec des graphiques interactifs
- 🔄 Mise à jour en temps réel des mesures
- 📱 Interface responsive adaptée à tous les appareils
- 📈 Analyses statistiques détaillées
- ⚡ Performance optimisée avec échantillonnage intelligent des données
- 🎨 Design moderne et intuitif

## Architecture

Le projet est composé de deux parties principales :

1. **Frontend (Angular)**
   - Interface utilisateur responsive
   - Graphiques temps réel avec Chart.js
   - Gestion d'état et mise à jour dynamique
   - Angular 18.2 avec composants standalone

2. **Backend (Rust)**
   - API RESTful pour la gestion des données
   - Base de données MariaDB/MySQL
   - Gestion des mesures de température et d'humidité
   - Optimisation des performances et mise en cache

## Prérequis

- Node.js (v18+)
- Angular CLI (v18.2+)
- MariaDB/MySQL
- Rust (pour le backend)
- npm ou yarn

## Installation

### Frontend

```bash
# Cloner le repository
git clone [url-du-repo]
cd meteo-dashboard

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera accessible à l'adresse `http://localhost:<meteo_dashboard_port>`

### Backend

```bash
cd meteo_api_server

# Installer les dépendances Rust
cargo build --release

# Configurer la base de données
mysql -u root -p < commandes_sql.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Démarrer le serveur
cargo run --release
```

## Structure du Projet

```
meteo_api_server/              # Backend Rust
└── src/                       # Code source du serveur
meteo-dashboard/
├── src/
│   ├── app/
│   │   ├── components/      # Composants de l'application
│   │   ├── services/        # Services pour la gestion des données
│   │   └── models/          # Interfaces et types
│   ├── assets/              # Ressources statiques
│   └── environments/        # Configuration par environnement
│
└── public/                  # Fichiers publics
```

## Composants Principaux

### LocationChartComponent
Affiche les données météo pour une localisation spécifique (intérieur/extérieur)
- Graphiques de température et d'humidité
- Mise à jour dynamique des données
- Filtrage par période

### StatsDashboardComponent
Tableau de bord avec statistiques en temps réel
- Valeurs actuelles
- Moyennes sur différentes périodes
- Indicateurs min/max

### CombinedChartComponent
Vue combinée des données intérieures et extérieures
- Comparaison directe des mesures
- Visualisation des tendances

## API Backend

### Endpoints

```
POST /push-measures
GET /measurements
GET /measurements/{location}
GET /stats
```

### Format des Données

```json
{
  "temperature": {
    "value": 23.5,
    "unit": "°C"
  },
  "humidity": {
    "value": 65.0,
    "unit": "%"
  },
  "location": "interior",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Configuration

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:<meteo_api_server_port>',
  updateInterval: 60000  // ms
};
```

### Backend (.env)
```env
DATABASE_URL=mysql://user:password@localhost/meteo_db
PORT=<meteo_api_server_port>
RUST_LOG=info
```

## Scripts Disponibles

```bash
# Frontend
npm start         # Démarre le serveur de développement
npm run build     # Build de production
npm run test      # Exécute les tests
npm run lint      # Vérifie le code

# Backend
cargo run        # Démarre le serveur en mode développement
cargo test       # Exécute les tests
cargo build --release  # Build de production
```

## Déploiement

### Production Frontend
```bash
npm run build
# Les fichiers de build seront dans ./dist/meteo-dashboard
```

### Production Backend
```bash
cargo build --release
# L'exécutable sera dans ./target/release
```

Utilisez le script `install.sh` fourni pour une installation complète sur le serveur.

## Maintenance

### Base de Données
```bash
# Backup
mysqldump -u root -p meteo_db > backup.sql

# Restore
mysql -u root -p meteo_db < backup.sql
```

### Logs
- Frontend: `/var/log/nginx/meteo-dashboard.log`
- Backend: `/var/log/meteo-server/`
- Base de données: `/var/log/mysql/`

## Dépannage

1. **Erreurs de connexion API**
   - Vérifier que le serveur backend est en cours d'exécution
   - Contrôler les paramètres CORS
   - Vérifier les logs du serveur

2. **Problèmes de Performance**
   - Vérifier la quantité de données chargées
   - Contrôler l'utilisation de la mémoire
   - Optimiser les requêtes SQL

3. **Erreurs de Build**
   - Vérifier la compatibilité des versions npm/node
   - Nettoyer le cache npm (`npm cache clean --force`)
   - Vérifier les dépendances (`npm audit`)

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nom-feature`)
3. Commit les changements (`git commit -m 'Add feature'`)
4. Push vers la branche (`git push origin feature/nom-feature`)
5. Ouvrir une Pull Request

## Licence

MIT License

## Contact

Pour toute question ou suggestion, ouvrez une issue sur le repository.