// Script de test pour vérifier la configuration email
// Usage: node scripts/test-email.js

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement manuellement
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

loadEnv();

async function testEmailConfiguration() {
  console.log('🔧 Test de la configuration email...\n');

  // Vérifier les variables d'environnement
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.log('\n💡 Assurez-vous de configurer votre fichier .env avec:');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=votre-email@gmail.com');
    console.log('   SMTP_PASS=votre-mot-de-passe-app');
    console.log('   ADMIN_EMAIL=admin@jetglass.com');
    return;
  }

  console.log('✅ Variables d\'environnement configurées');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Admin: ${process.env.ADMIN_EMAIL}\n`);

  // Créer le transporteur
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Tester la connexion
    console.log('🔗 Test de connexion SMTP...');
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie!\n');

    // Envoyer un email de test
    console.log('📧 Envoi d\'un email de test...');
    const testEmail = {
      from: `"JetGlass Test" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🧪 Test Email - Configuration JetGlass',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">🎉 Configuration Email Réussie!</h2>
          <p>Cet email confirme que la configuration Nodemailer fonctionne correctement.</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Détails de configuration:</h3>
            <ul>
              <li><strong>Host:</strong> ${process.env.SMTP_HOST}</li>
              <li><strong>Port:</strong> ${process.env.SMTP_PORT}</li>
              <li><strong>User:</strong> ${process.env.SMTP_USER}</li>
              <li><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Les notifications de devis sont maintenant opérationnelles! 🚀
          </p>
        </div>
      `,
      text: `
        Configuration Email Réussie!
        
        Cet email confirme que la configuration Nodemailer fonctionne correctement.
        
        Détails:
        - Host: ${process.env.SMTP_HOST}
        - Port: ${process.env.SMTP_PORT}
        - User: ${process.env.SMTP_USER}
        - Date: ${new Date().toLocaleString('fr-FR')}
        
        Les notifications de devis sont maintenant opérationnelles!
      `
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Email de test envoyé avec succès!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Destinataire: ${process.env.ADMIN_EMAIL}\n`);

    console.log('🎉 Configuration complète et fonctionnelle!');
    console.log('💡 Vous pouvez maintenant tester les notifications depuis votre application.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.log('\n🔍 Solutions possibles:');
    console.log('   1. Vérifiez vos identifiants SMTP');
    console.log('   2. Pour Gmail, utilisez un "Mot de passe d\'application"');
    console.log('   3. Vérifiez que l\'authentification à 2 facteurs est activée');
    console.log('   4. Vérifiez les paramètres de sécurité de votre compte email');
  }
}

// Exécuter le test
testEmailConfiguration();
