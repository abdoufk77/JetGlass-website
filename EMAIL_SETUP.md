# 📧 Configuration des Notifications Email - JetGlass

## Configuration requise

### 1. Variables d'environnement (.env)

Ajoutez ces variables à votre fichier `.env` :

```env
# Configuration SMTP (Gmail recommandé)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app

# Email de l'administrateur (recevra les notifications)
ADMIN_EMAIL=admin@jetglass.com
```

### 2. Configuration Gmail (recommandée)

1. **Activez l'authentification à 2 facteurs** sur votre compte Gmail
2. **Générez un mot de passe d'application** :
   - Allez dans Paramètres Google → Sécurité
   - Authentification à 2 facteurs → Mots de passe des applications
   - Sélectionnez "Autre" et nommez-le "JetGlass"
   - Utilisez ce mot de passe pour `SMTP_PASS`

## Test de configuration

### Option 1: Script de test
```bash
node scripts/test-email.js
```

### Option 2: API de test
```bash
curl http://localhost:3000/api/devis/notify
```

## Fonctionnement

### Déclenchement automatique
Les emails sont envoyés automatiquement quand un client :
- ✅ **Accepte** un devis
- 💬 **Demande une négociation**

### Contenu de l'email
- 📋 Détails du devis (référence, montant, client)
- 🎯 Action effectuée (accepté/négociation)
- 🔗 Lien direct vers l'admin
- 🎨 Design professionnel avec couleurs

### Intégration dans le code

```typescript
// Utilisation simple
import { sendQuoteActionNotification } from '@/lib/notifications';

await sendQuoteActionNotification(
  quoteId, 
  clientEmail, 
  'accepted' // ou 'negotiated'
);
```

## Dépannage

### Erreurs communes

1. **"Invalid login"** → Vérifiez le mot de passe d'application
2. **"Connection timeout"** → Vérifiez SMTP_HOST et SMTP_PORT
3. **"Authentication failed"** → Activez l'auth 2FA sur Gmail

### Logs utiles
Les logs sont visibles dans :
- Console du serveur Next.js
- Network tab du navigateur (pour les erreurs API)

## Sécurité

- ✅ Mots de passe d'application (pas le mot de passe principal)
- ✅ Variables d'environnement (pas de hardcoding)
- ✅ Validation des données avant envoi
- ✅ Gestion d'erreurs complète

## Support

Pour d'autres fournisseurs email :

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Serveur SMTP personnalisé
Adaptez `SMTP_HOST` et `SMTP_PORT` selon votre fournisseur.
