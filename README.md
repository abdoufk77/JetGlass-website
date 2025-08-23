# JetGlass - Site de Verrerie

Un site web complet pour une société de verrerie avec système de devis automatisé, inspiré d'AstiGlass.

## 🚀 Technologies

- **Frontend**: Next.js 14 (App Router), React 18, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de données**: SQLite
- **Authentification**: NextAuth.js
- **PDF**: PDFKit pour génération de devis
- **Email**: Nodemailer
- **UI**: Lucide React Icons, Components UI personnalisés

## ✨ Fonctionnalités

### Côté Public
- 🏠 **Page d'accueil** moderne avec présentation de JetGlass
- 📦 **Catalogue produits** avec filtres et recherche
- 📋 **Système de devis** interactif avec sélection de produits
- 📄 **Génération PDF automatique** des devis
- 📧 **Envoi email automatique** au client et admin
- 📱 **Design responsive** pour mobile et desktop

### Côté Admin
- 🔐 **Authentification sécurisée** avec NextAuth
- 📊 **Dashboard** avec statistiques en temps réel
- 🛠️ **CRUD Produits** (Créer, Lire, Modifier, Supprimer)
- 📋 **Gestion des devis** avec changement de statut
- ⚙️ **Paramètres société** (TVA, conditions, coordonnées)
- 📥 **Téléchargement des PDF** de devis

## 📁 Structure du Projet

```
projet/
├── app/
│   ├── (pages publiques)
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── produits/page.tsx     # Catalogue produits
│   │   └── devis/page.tsx        # Demande de devis
│   ├── admin/                    # Dashboard admin
│   │   ├── page.tsx              # Tableau de bord
│   │   ├── login/page.tsx        # Connexion admin
│   │   ├── produits/page.tsx     # Gestion produits
│   │   ├── devis/page.tsx        # Gestion devis
│   │   └── parametres/page.tsx   # Paramètres société
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth
│   │   ├── products/             # API Produits
│   │   ├── quotes/               # API Devis
│   │   └── settings/             # API Paramètres
│   ├── globals.css               # Styles globaux
│   └── layout.tsx                # Layout principal
├── components/
│   ├── ui/                       # Composants UI de base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── admin/
│   │   └── sidebar.tsx           # Sidebar admin
│   ├── navbar.tsx                # Navigation principale
│   └── footer.tsx                # Pied de page
├── lib/
│   ├── prisma.ts                 # Client Prisma
│   ├── auth.ts                   # Configuration NextAuth
│   ├── pdf.ts                    # Génération PDF
│   ├── email.ts                  # Envoi emails
│   └── utils.ts                  # Utilitaires
├── prisma/
│   ├── schema.prisma             # Schéma base de données
│   └── seed.ts                   # Données d'exemple
└── types/
    └── next-auth.d.ts            # Types NextAuth
```

## 🗄️ Base de Données

### Modèles Prisma

- **User**: Utilisateurs admin
- **Product**: Catalogue produits
- **Quote**: Devis clients
- **QuoteProduct**: Produits dans un devis
- **CompanySettings**: Paramètres société

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- Git

### 1. Cloner et installer

```bash
cd c:/Users/Abdou/Desktop/JetGlass/projet
npm install
```

### 2. Configuration environnement

Créer un fichier `.env` basé sur `.env.example`:

```bash
cp .env.example .env
```

Configurer les variables:

```env
# Base de données SQLite
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-très-longue"

# Configuration Email (Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"

# Admin par défaut
ADMIN_EMAIL="admin@jetglass.com"
ADMIN_PASSWORD="admin123"
```

### 3. Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer et migrer la base
npx prisma migrate dev --name init

# Insérer les données d'exemple
npm run db:seed
```

### 4. Démarrer le serveur

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔑 Accès Admin

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email**: `admin@jetglass.com`
- **Mot de passe**: `admin123`

## 📧 Configuration Email

Pour l'envoi automatique des devis par email:

1. **Gmail**: Activer l'authentification à 2 facteurs
2. **Mot de passe d'application**: Générer un mot de passe spécifique
3. **Variables d'environnement**: Configurer `SMTP_USER` et `SMTP_PASS`

## 🎨 Personnalisation

### Couleurs et Design
- Modifier `tailwind.config.js` pour les couleurs
- Éditer `app/globals.css` pour les styles personnalisés

### Logo et Branding
- Ajouter votre logo dans `/public/`
- Modifier les paramètres société dans l'admin

### Produits par Défaut
- Modifier `prisma/seed.ts` pour vos produits
- Relancer `npm run db:seed`

## 📋 Scripts Disponibles

```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm run start        # Démarrage production
npm run lint         # Vérification code
npm run db:migrate   # Migration base de données
npm run db:seed      # Insertion données test
npm run db:studio    # Interface Prisma Studio
```

## 🔧 API Endpoints

### Publics
- `GET /api/products` - Liste des produits
- `POST /api/quotes` - Création devis

### Admin (authentifié)
- `GET/POST/PUT/DELETE /api/products` - CRUD Produits
- `GET/PUT /api/quotes` - Gestion devis
- `GET/POST /api/settings` - Paramètres société

## 📱 Responsive Design

Le site est entièrement responsive avec:
- **Mobile First** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation mobile** avec menu hamburger
- **Grilles adaptatives** pour tous les écrans

## 🔒 Sécurité

- **Authentification** NextAuth avec sessions JWT
- **Protection routes** admin via middleware
- **Validation** des données côté serveur
- **Hachage** des mots de passe avec bcrypt

## 📄 Génération PDF

Les devis PDF incluent:
- **En-tête** avec logo et coordonnées
- **Informations client** et projet
- **Tableau produits** détaillé
- **Calculs** HT, TVA, TTC
- **Conditions** de vente et livraison
- **Mentions légales**

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes
- **Netlify**: Compatible avec build statique
- **Railway**: Support PostgreSQL intégré
- **Heroku**: Avec addon PostgreSQL

## 🤝 Support

Pour toute question ou problème:
1. Vérifier la configuration des variables d'environnement
2. S'assurer que PostgreSQL est démarré
3. Vérifier les logs avec `npm run dev`

## 📝 Licence

Ce projet est sous licence MIT. Libre d'utilisation et modification.

---

**JetGlass** - Votre spécialiste verrerie depuis 2024 🥃✨
