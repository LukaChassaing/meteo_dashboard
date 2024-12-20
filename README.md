# 🌡️ Meteo Dashboard

![Angular](https://img.shields.io/badge/Angular-18.2-DD0031?style=for-the-badge&logo=angular)
![Rust](https://img.shields.io/badge/Rust-Latest-000000?style=for-the-badge&logo=rust)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.6-FF6384?style=for-the-badge&logo=chart.js)
![License](https://img.shields.io/badge/License-GPL_3.0-blue?style=for-the-badge)

> Une application web moderne pour visualiser et analyser vos données météorologiques intérieures et extérieures

<p align="center">
  <img src="/api/placeholder/800/400" alt="Dashboard Preview">
</p>

## ✨ Fonctionnalités

* 📈 **Visualisations Interactives**
  * Graphiques en temps réel des températures et de l'humidité
  * Comparaison intérieur/extérieur
  * Zoom et filtrage des données

* 📊 **Analyse Avancée**
  * Statistiques détaillées par période
  * Calcul des tendances
  * Alertes personnalisables

* 🎯 **Performance Optimisée**
  * Échantillonnage intelligent des données
  * Mise en cache optimisée
  * Chargement progressif

* 📱 **Interface Responsive**
  * Adapté à tous les appareils
  * Design moderne et intuitif
  * Thème sombre/clair automatique

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v18+)
- Angular CLI (v18.2+)
- Rust (dernière version stable)
- MariaDB/MySQL

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/LukaChassaing/meteo-dashboard.git
cd meteo-dashboard
```

2. **Installer les dépendances frontend**
```bash
npm install
```

3. **Configurer la base de données**
```bash
mysql -u root -p < commandes_sql.txt
```

4. **Configurer l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

5. **Lancer le serveur de développement**
```bash
# Frontend
npm start

# Backend
cd meteo_api_server
cargo run --release
```

## 🏗️ Architecture

### Frontend (Angular 18.2)

```
src/
├── app/
│   ├── components/         # Composants réutilisables
│   ├── services/          # Services d'accès aux données
│   └── models/            # Interfaces et types
├── assets/                # Ressources statiques
└── environments/          # Configuration par environnement
```

### Backend (Rust)

- API RESTful
- Base de données MariaDB/MySQL
- Gestion optimisée des mesures
- Cache intelligent

## 📈 Composants Principaux

### LocationChartComponent
- Affichage des données par localisation
- Zoom interactif
- Filtrage temporel

### StatsDashboardComponent
- Statistiques en temps réel
- Indicateurs de tendance
- Alertes configurables

### CombinedChartComponent
- Vue comparée intérieur/extérieur
- Synchronisation des données
- Analyses croisées

## 🔧 Configuration

### Frontend (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  updateInterval: 60000  // ms
};
```

### Backend (`.env`)
```env
DATABASE_URL=mysql://user:password@localhost/meteo_db
PORT=3000
RUST_LOG=info
```

## 📱 Interface Responsive

- **Desktop**: Vue complète avec tous les graphiques
- **Tablet**: Disposition adaptative en colonnes
- **Mobile**: Interface optimisée et simplifiée

## 🔄 API Backend

### Endpoints

```
GET  /measurements           # Toutes les mesures
GET  /measurements/:location # Mesures par localisation
POST /push-measures         # Ajout de mesures
GET  /stats                 # Statistiques globales
```

### Format des Données

```json
{
  "temperature": 23.5,
  "humidity": 65.0,
  "location": "interior",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 📊 Performances

- **Échantillonnage Intelligent**: Réduction automatique des données
- **Mise en Cache**: Cache optimisé des requêtes fréquentes
- **Compression**: Gzip pour les transferts de données

## 🛠️ Développement

### Scripts Disponibles

```bash
# Frontend
npm start         # Serveur de développement
npm run build     # Build de production
npm run test      # Tests unitaires
npm run lint      # Vérification du code

# Backend
cargo run        # Mode développement
cargo test       # Tests
cargo build --release  # Build de production
```

### Tests

```bash
# Frontend
npm run test
npm run e2e

# Backend
cargo test
```

## 🚀 Déploiement

1. **Build Frontend**
```bash
npm run build
# Les fichiers seront dans ./dist/meteo-dashboard
```

2. **Build Backend**
```bash
cd meteo_api_server
cargo build --release
# L'exécutable sera dans ./target/release
```

3. **Configuration Serveur**
```bash
# Utiliser le script d'installation fourni
./install.sh
```

## 📝 Maintenance

### Backup Base de Données
```bash
mysqldump -u root -p meteo_db > backup.sql
```

### Restauration
```bash
mysql -u root -p meteo_db < backup.sql
```

### Logs
- Frontend: `/var/log/nginx/meteo-dashboard.log`
- Backend: `/var/log/meteo-server/`
- Base de données: `/var/log/mysql/`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche
```bash
git checkout -b feature/amazing-feature
```
3. Commit les changements
```bash
git commit -m 'Add amazing feature'
```
4. Push
```bash
git push origin feature/amazing-feature
```
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence GPL-3.0 - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Angular](https://angular.dev)
- [Rust](https://www.rust-lang.org)
- [Chart.js](https://www.chartjs.org)
- [FontAwesome](https://fontawesome.com)

---

<p align="center">
  Développé avec ❤️ par Luka Chassaing
</p>