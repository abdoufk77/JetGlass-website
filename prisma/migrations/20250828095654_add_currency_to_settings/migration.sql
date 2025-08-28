-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'JetGlass',
    "address" TEXT NOT NULL DEFAULT '123 Rue de la Verrerie, 69000 Lyon, France',
    "phone" TEXT NOT NULL DEFAULT '+33 4 78 12 34 56',
    "email" TEXT NOT NULL DEFAULT 'contact@jetglass.fr',
    "website" TEXT NOT NULL DEFAULT 'www.jetglass.fr',
    "logo" TEXT,
    "description" TEXT NOT NULL DEFAULT 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans',
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "linkedinUrl" TEXT,
    "instagramUrl" TEXT,
    "workingHours" TEXT NOT NULL DEFAULT 'Lundi - Vendredi: 8h00 - 18h00, Samedi: 9h00 - 12h00',
    "tvaRate" REAL NOT NULL DEFAULT 20.0,
    "currency" TEXT NOT NULL DEFAULT 'DH',
    "paymentTerms" TEXT NOT NULL DEFAULT '50% à la commande, 50% à l''enlèvement',
    "deliveryTerms" TEXT NOT NULL DEFAULT '1 semaine pour les produits standards, 4 semaines pour les produits spéciaux',
    "legalNotice" TEXT NOT NULL DEFAULT 'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_company_settings" ("address", "createdAt", "deliveryTerms", "description", "email", "facebookUrl", "id", "instagramUrl", "legalNotice", "linkedinUrl", "logo", "name", "paymentTerms", "phone", "tvaRate", "twitterUrl", "updatedAt", "website", "workingHours") SELECT "address", "createdAt", "deliveryTerms", "description", "email", "facebookUrl", "id", "instagramUrl", "legalNotice", "linkedinUrl", "logo", "name", "paymentTerms", "phone", "tvaRate", "twitterUrl", "updatedAt", "website", "workingHours" FROM "company_settings";
DROP TABLE "company_settings";
ALTER TABLE "new_company_settings" RENAME TO "company_settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
