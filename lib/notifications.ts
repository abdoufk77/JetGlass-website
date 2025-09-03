// Fonction utilitaire pour envoyer des notifications depuis le frontend
export async function sendQuoteActionNotification(
  quoteId: string, 
  clientEmail: string, 
  action: 'accepted' | 'negotiated'
) {
  try {
    const response = await fetch('/api/devis/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteId,
        clientEmail,
        action
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'envoi de la notification');
    }

    const result = await response.json();
    console.log('Notification envoyée avec succès:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    throw error;
  }
}

// Fonction pour tester la configuration email
export async function testEmailConfig() {
  try {
    const response = await fetch('/api/devis/notify', {
      method: 'GET',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur lors du test email:', error);
    return { success: false, error: 'Erreur de connexion' };
  }
}
