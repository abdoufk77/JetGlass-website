import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { Quote, QuoteProduct, Product } from '@prisma/client'
import { formatPrice, numberToWords } from './utils'

type QuoteWithProducts = Quote & {
  products: (QuoteProduct & {
    product: Product
  })[]
}

export async function generateQuotePDF(quote: QuoteWithProducts, companySettings: any): Promise<string> {
  const doc = new PDFDocument({ margin: 50 })
  const fileName = `devis-${quote.quoteNumber}.pdf`
  const filePath = path.join(process.cwd(), 'public', 'quotes', fileName)
  
  // Ensure directory exists
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const stream = fs.createWriteStream(filePath)
  doc.pipe(stream)
  
  // Header
  doc.fontSize(20)
     .fillColor('#2563eb')
     .text('JETGLASS', 50, 50)
     .fontSize(12)
     .fillColor('#000')
     .text(companySettings.address || 'Adresse de l\'entreprise', 50, 80)
     .text(companySettings.phone || 'Téléphone', 50, 95)
     .text(companySettings.email || 'Email', 50, 110)
  
  // Quote info
  doc.fontSize(16)
     .fillColor('#2563eb')
     .text('DEVIS', 400, 50)
     .fontSize(12)
     .fillColor('#000')
     .text(`N° ${quote.quoteNumber}`, 400, 80)
     .text(`Date: ${new Date(quote.createdAt).toLocaleDateString('fr-FR')}`, 400, 95)
     .text(`Référence: ${quote.projectRef || 'N/A'}`, 400, 110)
  
  // Client info
  doc.fontSize(14)
     .fillColor('#2563eb')
     .text('CLIENT', 50, 150)
     .fontSize(12)
     .fillColor('#000')
     .text(quote.clientName, 50, 175)
     .text(quote.clientEmail, 50, 190)
     .text(quote.clientPhone || '', 50, 205)
  
  // Products table
  let yPosition = 250
  
  // Table header
  doc.fontSize(12)
     .fillColor('#f3f4f6')
     .rect(50, yPosition, 500, 25)
     .fill()
     .fillColor('#000')
     .text('Référence', 60, yPosition + 8)
     .text('Désignation', 140, yPosition + 8)
     .text('Dimensions', 280, yPosition + 8)
     .text('Qté', 360, yPosition + 8)
     .text('Prix HT', 400, yPosition + 8)
     .text('Total HT', 480, yPosition + 8)
  
  yPosition += 25
  
  // Table rows
  quote.products.forEach((item) => {
    doc.fillColor('#000')
       .text(item.product.reference, 60, yPosition + 8)
       .text(item.product.name, 140, yPosition + 8)
       .text(item.product.dimensions || '-', 280, yPosition + 8)
       .text(item.quantity.toString(), 360, yPosition + 8)
       .text(formatPrice(item.priceHT), 400, yPosition + 8)
       .text(formatPrice(item.totalHT), 480, yPosition + 8)
    
    yPosition += 25
  })
  
  // Summary
  yPosition += 20
  const tvaAmount = quote.totalHT * (quote.tva / 100)
  
  doc.fontSize(12)
     .text(`Total HT: ${formatPrice(quote.totalHT)}`, 400, yPosition)
     .text(`TVA (${quote.tva}%): ${formatPrice(tvaAmount)}`, 400, yPosition + 20)
     .fontSize(14)
     .fillColor('#2563eb')
     .text(`Total TTC: ${formatPrice(quote.totalTTC)}`, 400, yPosition + 45)
     .fontSize(12)
     .fillColor('#000')
     .text(`Montant en lettres: ${numberToWords(Math.round(quote.totalTTC))} euros`, 50, yPosition + 80)
  
  // Conditions
  yPosition += 120
  doc.fontSize(14)
     .fillColor('#2563eb')
     .text('CONDITIONS', 50, yPosition)
     .fontSize(10)
     .fillColor('#000')
     .text(`Modalité de paiement: ${companySettings.paymentTerms}`, 50, yPosition + 25)
     .text(`Délais de livraison: ${companySettings.deliveryTerms}`, 50, yPosition + 40)
     .text(`Note: ${companySettings.legalNotice}`, 50, yPosition + 55)
  
  doc.end()
  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(`/quotes/${fileName}`)
    })
    stream.on('error', reject)
  })
}
