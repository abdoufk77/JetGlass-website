import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour 465, false pour autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface NotificationEmailData {
  quoteId: string;
  clientEmail: string;
  clientAction: 'accepted' | 'negotiated';
  quoteDetails?: {
    reference?: string;
    totalAmount?: number;
    clientName?: string;
  };
}

export interface QuoteEmailData {
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  totalAmount: number;
  quoteId: string;
}

export async function sendQuoteNotification(data: NotificationEmailData) {
  try {
    const { quoteId, clientEmail, clientAction, quoteDetails } = data;
    
    const actionText = clientAction === 'accepted' ? 'accepté' : 'demandé une négociation pour';
    const subject = `Notification Devis - Client a ${actionText} le devis ${quoteDetails?.reference || quoteId}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">
            🔔 Notification de Devis - JetGlass
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin-top: 0;">
              Le client a ${actionText} un devis
            </h3>
            
            <div style="margin: 15px 0;">
              <strong>Détails du devis:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Référence:</strong> ${quoteDetails?.reference || quoteId}</li>
                <li><strong>Email client:</strong> ${clientEmail}</li>
                <li><strong>Action:</strong> ${clientAction === 'accepted' ? 'Accepté ✅' : 'Négociation demandée 💬'}</li>
                ${quoteDetails?.totalAmount ? `<li><strong>Montant:</strong> ${quoteDetails.totalAmount} MAD</li>` : ''}
                ${quoteDetails?.clientName ? `<li><strong>Client:</strong> ${quoteDetails.clientName}</li>` : ''}
              </ul>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: ${clientAction === 'accepted' ? '#dcfce7' : '#fef3c7'}; border-radius: 4px;">
              <p style="margin: 0; color: ${clientAction === 'accepted' ? '#166534' : '#92400e'};">
                ${clientAction === 'accepted' 
                  ? '🎉 Le client a accepté le devis. Vous pouvez procéder à la commande.' 
                  : '💬 Le client souhaite négocier. Veuillez le contacter pour discuter des modifications.'}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/devis" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Voir dans l'admin
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
            Cette notification a été envoyée automatiquement par le système JetGlass.
          </p>
        </div>
      </div>
    `;

    const textContent = `
      Notification de Devis - JetGlass
      
      Le client a ${actionText} le devis ${quoteDetails?.reference || quoteId}
      
      Détails:
      - Référence: ${quoteDetails?.reference || quoteId}
      - Email client: ${clientEmail}
      - Action: ${clientAction === 'accepted' ? 'Accepté' : 'Négociation demandée'}
      ${quoteDetails?.totalAmount ? `- Montant: ${quoteDetails.totalAmount} MAD` : ''}
      ${quoteDetails?.clientName ? `- Client: ${quoteDetails.clientName}` : ''}
      
      ${clientAction === 'accepted' 
        ? 'Le client a accepté le devis. Vous pouvez procéder à la commande.' 
        : 'Le client souhaite négocier. Veuillez le contacter pour discuter des modifications.'}
      
      Voir dans l'admin: ${process.env.NEXTAUTH_URL}/admin/devis
    `;

    const mailOptions = {
      from: `"JetGlass System" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      text: textContent,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email de notification envoyé:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error(`Échec de l'envoi de l'email: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Fonction pour envoyer le devis au client
export async function sendQuoteToClient(data: QuoteEmailData) {
  try {
    const { clientEmail, clientName, quoteNumber, totalAmount, quoteId } = data;
    
    const subject = `Votre devis JetGlass - ${quoteNumber}`;
    const quoteUrl = `${process.env.NEXTAUTH_URL}/devis/${quoteId}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">
            📋 Votre Devis JetGlass
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin-top: 0;">
              Bonjour ${clientName},
            </h3>
            
            <p style="margin: 15px 0; line-height: 1.6;">
              Nous avons le plaisir de vous transmettre votre devis personnalisé. 
              Vous pouvez le consulter et répondre directement en ligne.
            </p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f0f9ff; border-radius: 4px;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af;">Détails du devis:</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Référence:</strong> ${quoteNumber}</li>
                <li><strong>Montant total TTC:</strong> ${totalAmount.toFixed(2)} MAD</li>
                <li><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${quoteUrl}" 
                 style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                📋 Consulter mon devis
              </a>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #ecfdf5; border-radius: 4px;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                💡 <strong>Actions disponibles:</strong><br>
                • Accepter le devis en un clic<br>
                • Demander une négociation<br>
                • Télécharger le PDF
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 12px;">
              Merci de votre confiance.<br>
              L'équipe JetGlass Industry
            </p>
          </div>
        </div>
      </div>
    `;

    const textContent = `
      Votre Devis JetGlass - ${quoteNumber}
      
      Bonjour ${clientName},
      
      Nous avons le plaisir de vous transmettre votre devis personnalisé.
      
      Détails:
      - Référence: ${quoteNumber}
      - Montant total TTC: ${totalAmount.toFixed(2)} MAD
      - Date: ${new Date().toLocaleDateString('fr-FR')}
      
      Consultez votre devis: ${quoteUrl}
      
      Actions disponibles:
      • Accepter le devis en un clic
      • Demander une négociation
      • Télécharger le PDF
      
      Merci de votre confiance.
      L'équipe JetGlass Industry
    `;

    const mailOptions = {
      from: `"JetGlass Industry" <${process.env.SMTP_USER}>`,
      to: clientEmail,
      subject,
      text: textContent,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Devis envoyé au client:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi du devis:', error);
    throw new Error(`Échec de l'envoi du devis: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Fonction pour tester la configuration email
export async function testEmailConfiguration() {
  try {
    await transporter.verify();
    console.log('Configuration email valide');
    return { success: true };
  } catch (error) {
    console.error('Configuration email invalide:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}
