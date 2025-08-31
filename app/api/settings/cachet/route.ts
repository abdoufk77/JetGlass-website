import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/cachets')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('cachet') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez PNG, JPG ou JPEG.' },
        { status: 400 }
      )
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximale: 5MB.' },
        { status: 400 }
      )
    }

    // Créer le dossier s'il n'existe pas
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const fileName = `cachet-${timestamp}${extension}`
    const filePath = path.join(UPLOAD_DIR, fileName)

    // Convertir le fichier en buffer et le sauvegarder
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Récupérer les paramètres actuels pour supprimer l'ancien cachet
    const currentSettings = await prisma.companySettings.findFirst()
    const settingsWithCachet = currentSettings as any
    if (settingsWithCachet?.cachetUrl && settingsWithCachet?.cachetFileName) {
      const oldFilePath = path.join(UPLOAD_DIR, settingsWithCachet.cachetFileName)
      try {
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath)
        }
      } catch (error) {
        console.warn('Impossible de supprimer l\'ancien cachet:', error)
      }
    }

    // URL publique du fichier
    const cachetUrl = `/uploads/cachets/${fileName}`

    // Mettre à jour les paramètres avec le nouveau cachet
    let settings
    if (currentSettings) {
      await prisma.$executeRaw`
        UPDATE company_settings SET 
          "cachetUrl" = ${cachetUrl},
          "cachetFileName" = ${fileName},
          "updatedAt" = NOW()
        WHERE id = ${currentSettings.id}
      `
      settings = await prisma.companySettings.findFirst()
    } else {
      // Créer les paramètres avec le cachet
      await prisma.$executeRaw`
        INSERT INTO company_settings (
          "id", "name", "cachetUrl", "cachetFileName", "createdAt", "updatedAt"
        ) VALUES (
          'default',
          'JetGlass',
          ${cachetUrl},
          ${fileName},
          NOW(),
          NOW()
        )
      `
      settings = await prisma.companySettings.findFirst()
    }

    return NextResponse.json({
      message: 'Cachet uploadé avec succès',
      cachetUrl,
      settings
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload du cachet:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du cachet' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const settings = await prisma.companySettings.findFirst()
    const settingsWithCachet = settings as any
    
    if (!settingsWithCachet?.cachetUrl || !settingsWithCachet?.cachetFileName) {
      return NextResponse.json(
        { error: 'Aucun cachet à supprimer' },
        { status: 404 }
      )
    }

    // Supprimer le fichier physique
    const filePath = path.join(UPLOAD_DIR, settingsWithCachet.cachetFileName)
    try {
      if (existsSync(filePath)) {
        await unlink(filePath)
      }
    } catch (error) {
      console.warn('Impossible de supprimer le fichier cachet:', error)
    }

    // Mettre à jour les paramètres
    await prisma.$executeRaw`
      UPDATE company_settings SET 
        "cachetUrl" = NULL,
        "cachetFileName" = NULL,
        "updatedAt" = NOW()
      WHERE id = ${settings!.id}
    `

    const updatedSettings = await prisma.companySettings.findFirst()

    return NextResponse.json({
      message: 'Cachet supprimé avec succès',
      settings: updatedSettings
    })

  } catch (error) {
    console.error('Erreur lors de la suppression du cachet:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du cachet' },
      { status: 500 }
    )
  }
}
