import nodemailer from 'nodemailer'
import fs from 'fs'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendQuoteEmail(
  clientEmail: string,
  clientName: string,
  quoteNumber: string,
  pdfPath: string
) {
  const fullPdfPath = `${process.cwd()}/public${pdfPath}`
  
  // Email to client
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: clientEmail,
    subject: `Devis JetGlass - ${quoteNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">JetGlass</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Votre spécialiste en verrerie</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-top: 0;">Bonjour ${clientName},</h2>
          
          <p style="color: #475569; line-height: 1.6;">
            Nous vous remercions pour votre demande de devis. Vous trouverez en pièce jointe 
            votre devis personnalisé <strong>${quoteNumber}</strong>.
          </p>
          
          <div style="background: white; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #1e293b; margin-top: 0;">Informations importantes :</h3>
            <ul style="color: #475569; line-height: 1.6;">
              <li>Ce devis est valable 30 jours</li>
              <li>Modalité de paiement : 50% à la commande, 50% à l'enlèvement</li>
              <li>Délais de livraison : 1 semaine standard, 4 semaines spécial</li>
            </ul>
          </div>
          
          <p style="color: #475569; line-height: 1.6;">
            Pour toute question ou modification, n'hésitez pas à nous contacter.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${process.env.SMTP_USER}" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Nous contacter
            </a>
          </div>
        </div>
        
        <div style="background: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">
            JetGlass - Votre partenaire verrerie de confiance
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `devis-${quoteNumber}.pdf`,
        path: fullPdfPath,
      },
    ],
  })

  // Email to admin
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: `Nouveau devis généré - ${quoteNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Nouveau devis généré</h2>
        <p><strong>Numéro :</strong> ${quoteNumber}</p>
        <p><strong>Client :</strong> ${clientName}</p>
        <p><strong>Email :</strong> ${clientEmail}</p>
        <p>Le devis a été envoyé au client et est disponible en pièce jointe.</p>
      </div>
    `,
    attachments: [
      {
        filename: `devis-${quoteNumber}.pdf`,
        path: fullPdfPath,
      },
    ],
  })
}
