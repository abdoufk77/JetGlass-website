/*
  Warnings:

  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `priceHT` on the `products` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quote_products" ADD COLUMN "length" REAL;
ALTER TABLE "quote_products" ADD COLUMN "thickness" REAL;
ALTER TABLE "quote_products" ADD COLUMN "width" REAL;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

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
    "paymentTerms" TEXT NOT NULL DEFAULT '50% à la commande, 50% à l''enlèvement',
    "deliveryTerms" TEXT NOT NULL DEFAULT '1 semaine pour les produits standards, 4 semaines pour les produits spéciaux',
    "legalNotice" TEXT NOT NULL DEFAULT 'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_company_settings" ("address", "createdAt", "deliveryTerms", "email", "id", "legalNotice", "logo", "name", "paymentTerms", "phone", "tvaRate", "updatedAt", "website") SELECT coalesce("address", '123 Rue de la Verrerie, 69000 Lyon, France') AS "address", "createdAt", "deliveryTerms", coalesce("email", 'contact@jetglass.fr') AS "email", "id", "legalNotice", "logo", "name", "paymentTerms", coalesce("phone", '+33 4 78 12 34 56') AS "phone", "tvaRate", "updatedAt", coalesce("website", 'www.jetglass.fr') AS "website" FROM "company_settings";
DROP TABLE "company_settings";
ALTER TABLE "new_company_settings" RENAME TO "company_settings";
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "basePricePerM2" REAL NOT NULL DEFAULT 0,
    "complexityFactor" REAL NOT NULL DEFAULT 1,
    "thicknessFactor" REAL NOT NULL DEFAULT 1,
    "minPrice" REAL NOT NULL DEFAULT 50,
    "dimensions" TEXT,
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("active", "createdAt", "description", "dimensions", "id", "image", "name", "reference", "updatedAt") SELECT "active", "createdAt", "description", "dimensions", "id", "image", "name", "reference", "updatedAt" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_reference_key" ON "products"("reference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
