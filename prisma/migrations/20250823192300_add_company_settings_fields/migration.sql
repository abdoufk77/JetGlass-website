-- AlterTable
ALTER TABLE "company_settings" ADD COLUMN "description" TEXT NOT NULL DEFAULT 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans';
ALTER TABLE "company_settings" ADD COLUMN "facebookUrl" TEXT;
ALTER TABLE "company_settings" ADD COLUMN "twitterUrl" TEXT;
ALTER TABLE "company_settings" ADD COLUMN "linkedinUrl" TEXT;
ALTER TABLE "company_settings" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "company_settings" ADD COLUMN "workingHours" TEXT NOT NULL DEFAULT 'Lundi - Vendredi: 8h00 - 18h00, Samedi: 9h00 - 12h00';

-- Update existing records with default values
UPDATE "company_settings" SET 
  "address" = '123 Rue de la Verrerie, 69000 Lyon, France',
  "phone" = '+33 4 78 12 34 56',
  "email" = 'contact@jetglass.fr',
  "website" = 'www.jetglass.fr'
WHERE "address" IS NULL OR "phone" IS NULL OR "email" IS NULL OR "website" IS NULL;
