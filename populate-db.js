// Script simple pour peupler la base de données
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./prisma/dev.db');

async function populateDB() {
  console.log('🌱 Peuplement de la base de données...');

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Insert admin user
    db.run(`INSERT OR REPLACE INTO users (id, email, password, name, role, createdAt, updatedAt) 
            VALUES ('admin', 'admin@jetglass.com', ?, 'Admin JetGlass', 'ADMIN', datetime('now'), datetime('now'))`, 
            [hashedPassword], function(err) {
      if (err) console.error('Erreur user:', err);
      else console.log('✅ Utilisateur admin créé');
    });

    // Insert company settings
    db.run(`INSERT OR REPLACE INTO company_settings (
              id, name, address, phone, email, website, description, workingHours,
              tvaRate, paymentTerms, deliveryTerms, legalNotice, createdAt, updatedAt
            ) VALUES (
              'default', 'JetGlass', 
              '123 Rue de la Verrerie, 69000 Lyon, France',
              '+33 4 78 12 34 56',
              'contact@jetglass.fr',
              'www.jetglass.fr',
              'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans',
              'Lundi - Vendredi: 8h00 - 18h00, Samedi: 9h00 - 12h00',
              20.0,
              '50% à la commande, 50% à l''enlèvement',
              '1 semaine pour les produits standards, 4 semaines pour les produits spéciaux',
              'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication',
              datetime('now'), datetime('now')
            )`, function(err) {
      if (err) console.error('Erreur settings:', err);
      else console.log('✅ Paramètres entreprise créés');
    });

    // Insert categories
    const categories = [
      ['cat1', 'Verres de sécurité', 'Verres trempés et feuilletés pour applications sécurisées'],
      ['cat2', 'Double vitrage', 'Solutions d\'isolation thermique et acoustique'],
      ['cat3', 'Verres décoratifs', 'Verres colorés, sablés et texturés pour décoration'],
      ['cat4', 'Miroirs', 'Miroirs sur mesure pour tous usages'],
      ['cat5', 'Verres techniques', 'Verres spéciaux pour applications industrielles']
    ];

    categories.forEach(([id, name, description]) => {
      db.run(`INSERT OR REPLACE INTO categories (id, name, description, active, createdAt, updatedAt) 
              VALUES (?, ?, ?, 1, datetime('now'), datetime('now'))`, 
              [id, name, description], function(err) {
        if (err) console.error('Erreur catégorie:', err);
        else console.log('✅ Catégorie créée:', name);
      });
    });

    // Insert products
    const products = [
      ['prod1', 'VER-001', 'Verre trempé 6mm', 'Verre de sécurité trempé épaisseur 6mm', 'cat1', 45.0, 1.0, 1.0, 50.0],
      ['prod2', 'VER-002', 'Verre trempé 8mm', 'Verre de sécurité trempé épaisseur 8mm', 'cat1', 55.0, 1.1, 1.2, 65.0],
      ['prod3', 'DV-001', 'Double vitrage 4/16/4', 'Double vitrage isolant avec lame d\'air 16mm', 'cat2', 85.0, 1.2, 1.5, 120.0],
      ['prod4', 'DV-002', 'Double vitrage 6/20/6', 'Double vitrage haute performance', 'cat2', 105.0, 1.3, 1.8, 150.0],
      ['prod5', 'DEC-001', 'Verre sablé', 'Verre dépoli par sablage pour intimité', 'cat3', 65.0, 1.4, 1.1, 80.0],
      ['prod6', 'MIR-001', 'Miroir 4mm', 'Miroir argenté épaisseur 4mm', 'cat4', 35.0, 1.0, 0.9, 40.0],
      ['prod7', 'TECH-001', 'Verre anti-reflet', 'Verre traité anti-reflet pour vitrines', 'cat5', 95.0, 1.6, 1.2, 130.0]
    ];

    products.forEach(([id, ref, name, desc, catId, basePrice, complexity, thickness, minPrice]) => {
      db.run(`INSERT OR REPLACE INTO products (
                id, reference, name, description, categoryId, basePricePerM2, 
                complexityFactor, thicknessFactor, minPrice, dimensions, active, createdAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Sur mesure', 1, datetime('now'), datetime('now'))`, 
              [id, ref, name, desc, catId, basePrice, complexity, thickness, minPrice], function(err) {
        if (err) console.error('Erreur produit:', err);
        else console.log('✅ Produit créé:', name);
      });
    });

    setTimeout(() => {
      console.log('🎉 Base de données peuplée avec succès!');
      db.close();
    }, 2000);

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

populateDB();
