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
  try {
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4'
    })
    const fileName = `devis-${quote.quoteNumber}.pdf`
    const filePath = path.join(process.cwd(), 'public', 'quotes', fileName)
    
    // Ensure directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    const stream = fs.createWriteStream(filePath)
    doc.pipe(stream)
    
    // Page dimensions
    const pageWidth = doc.page.width
    const margin = 40
    const contentWidth = pageWidth - (margin * 2)
    
    // Header with company info and logo area
    doc.fontSize(24)
       .fillColor('#1e40af')
       .text('JetGlass', margin, 50)
       .fontSize(14)
       .text('INDUSTRY', margin + 120, 58)
    
    // Blue header line
    doc.rect(margin, 90, contentWidth, 3)
       .fillColor('#1e40af')
       .fill()
    
    // Company details (left side)
    doc.fontSize(10)
       .fillColor('#000')
       .text(companySettings.address || 'Adresse de l\'entreprise', margin, 110)
       .text(`Tél: ${companySettings.phone || 'Téléphone'}`, margin, 125)
       .text(`Email: ${companySettings.email || 'Email'}`, margin, 140)
    
    // Quote info boxes (right side)
    const rightX = pageWidth - 200
    
    // Devis N° box
    doc.rect(rightX - 50, 110, 180, 25)
       .stroke()
    doc.fontSize(10)
       .text('Devis N°:', rightX - 45, 118)
       .text(quote.quoteNumber, rightX - 45, 128)
    
    // Date and client info box
    doc.rect(rightX - 50, 140, 180, 40)
       .stroke()
    doc.text('Date:', rightX - 45, 148)
       .text(new Date(quote.createdAt).toLocaleDateString('fr-FR'), rightX + 20, 148)
       .text('Client:', rightX - 45, 163)
       .text(quote.clientName.substring(0, 20), rightX + 20, 163)
    
    // Client details section
    let yPos = 200
    doc.fontSize(12)
       .fillColor('#1e40af')
       .text('Nous avons l\'honneur de vous remettre ci-joint nos meilleures offres de prix, vous en souhaitant bonne réception, nous espérons que', margin, yPos)
    yPos += 15
    doc.text('notre offre retiendra votre attention et voudra la faveur de votre aimable commande pour laquelle nous apporterons nos meilleurs soins.', margin, yPos)
    
    // Client info box
    yPos += 30
    doc.rect(margin, yPos, 250, 60)
       .stroke()
    doc.fontSize(10)
       .fillColor('#000')
       .text('V/Réf:', margin + 10, yPos + 10)
       .text(quote.projectRef || quote.quoteNumber, margin + 50, yPos + 10)
       .text('Projet:', margin + 10, yPos + 25)
       .text(quote.clientName, margin + 50, yPos + 25)
       .text('Email:', margin + 10, yPos + 40)
       .text(quote.clientEmail, margin + 50, yPos + 40)
    
    // Products table
    yPos += 80
    const tableStartY = yPos
    
    // Table headers
    const colWidths = [80, 120, 60, 40, 60, 60, 80, 80]
    const colPositions = [margin]
    for (let i = 1; i < colWidths.length; i++) {
      colPositions[i] = colPositions[i-1] + colWidths[i-1]
    }
    
    // Header background
    doc.rect(margin, yPos, contentWidth, 25)
       .fillColor('#f0f0f0')
       .fill()
       .stroke()
    
    // Header text
    doc.fontSize(9)
       .fillColor('#000')
       .text('Référence', colPositions[0] + 5, yPos + 8)
       .text('Désignation', colPositions[1] + 5, yPos + 8)
       .text('Qte', colPositions[2] + 5, yPos + 8)
       .text('Lar M', colPositions[3] + 5, yPos + 8)
       .text('Lon M', colPositions[4] + 5, yPos + 8)
       .text('Ep M', colPositions[5] + 5, yPos + 8)
       .text('PU', colPositions[6] + 5, yPos + 8)
       .text('Total (DH)', colPositions[7] + 5, yPos + 8)
    
    yPos += 25
    
    // Table rows
    quote.products.forEach((item, index) => {
      const rowHeight = 25
      
      // Row background (alternating)
      if (index % 2 === 1) {
        doc.rect(margin, yPos, contentWidth, rowHeight)
           .fillColor('#f9f9f9')
           .fill()
      }
      
      // Row borders
      doc.rect(margin, yPos, contentWidth, rowHeight)
         .stroke()
      
      // Vertical lines
      for (let i = 1; i < colPositions.length; i++) {
        doc.moveTo(colPositions[i], yPos)
           .lineTo(colPositions[i], yPos + rowHeight)
           .stroke()
      }
      
      // Row data
      doc.fontSize(8)
         .fillColor('#000')
         .text(item.product.reference || '', colPositions[0] + 3, yPos + 8)
         .text(item.product.name.substring(0, 18) || '', colPositions[1] + 3, yPos + 8)
         .text(item.quantity.toString(), colPositions[2] + 3, yPos + 8)
         .text(item.width ? (item.width / 100).toFixed(2) : '0', colPositions[3] + 3, yPos + 8)
         .text(item.length ? (item.length / 100).toFixed(2) : '0', colPositions[4] + 3, yPos + 8)
         .text(item.thickness ? (item.thickness / 10).toFixed(1) : '6', colPositions[5] + 3, yPos + 8)
         .text(item.priceHT.toFixed(2), colPositions[6] + 3, yPos + 8)
         .text(item.totalHT.toFixed(2), colPositions[7] + 3, yPos + 8)
      
      yPos += rowHeight
    })
    
    // Summary section
    yPos += 20
    const summaryX = pageWidth - 200
    
    // Summary box
    doc.rect(summaryX, yPos, 150, 80)
       .stroke()
    
    const tvaAmount = quote.totalHT * (quote.tva / 100)
    
    doc.fontSize(10)
       .text('TOTAL HT', summaryX + 10, yPos + 10)
       .text(quote.totalHT.toFixed(2), summaryX + 100, yPos + 10)
       .text('TVA 20%', summaryX + 10, yPos + 30)
       .text(tvaAmount.toFixed(2), summaryX + 100, yPos + 30)
    
    // Total TTC highlighted
    doc.fontSize(12)
       .fillColor('#1e40af')
       .text('Montant Total Net TTC', summaryX + 10, yPos + 55)
       .text(quote.totalTTC.toFixed(2), summaryX + 100, yPos + 55)
    
    // Footer section
    yPos += 120
    doc.fontSize(10)
       .fillColor('#000')
       .text('Arrêtée la présente Offre de prix à la somme de :', margin, yPos)
    
    yPos += 20
    doc.fontSize(12)
       .fillColor('#1e40af')
       .text(`${numberToWords(Math.round(quote.totalTTC))} Dirhams`, margin, yPos)
    
    // Payment terms
    yPos += 40
    doc.fontSize(9)
       .fillColor('#000')
       .text('Mode de Paiement :', margin, yPos)
       .text(companySettings.paymentTerms || '50% à la commande, 50% à la livraison', margin, yPos + 15)
       .text('Modalité de livraison:', margin, yPos + 30)
       .text(companySettings.deliveryTerms || 'Livraison sous 2-3 semaines', margin, yPos + 45)
    
    // Legal notice
    yPos += 80
    doc.fontSize(8)
       .text(companySettings.legalNotice || 'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication', margin, yPos)
    
    doc.end()
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve(`/quotes/${fileName}`)
      })
      stream.on('error', reject)
    })
  } catch (error) {
    console.error('PDF Generation Error:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate PDF: ${error.message}`)
    }
    throw new Error(`Failed to generate PDF: ${String(error)}`)
  }
}
