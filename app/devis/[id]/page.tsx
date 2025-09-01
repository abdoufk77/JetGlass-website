'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import QuotePreview from '@/components/admin/QuotePreview'
import { useToast } from '@/components/ui/toast'

// TODO: Remplacer par le vrai type de devis
type FullQuote = any;

export default function QuotePage() {
  const { addToast } = useToast();
  const params = useParams()
  const id = params.id as string
  const [quote, setQuote] = useState<FullQuote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchQuote = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/quotes/${id}`)
          if (!response.ok) {
            throw new Error('Devis non trouvé')
          }
          const data = await response.json()
          setQuote(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        } finally {
          setLoading(false)
        }
      }
      fetchQuote()
    }
  }, [id])

  const handleUpdateStatus = async (status: 'ACCEPTED' | 'PENDING') => {
    try {
      const response = await fetch(`/api/quotes/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur lors de la mise à jour du statut`);
      }

      const updatedQuote = await response.json();
      setQuote(updatedQuote);
            addToast({
        title: 'Statut mis à jour',
        description: `Le devis a été marqué comme ${status === 'ACCEPTED' ? 'accepté' : 'en négociation'}.`,
        type: 'success',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
            addToast({
        title: 'Erreur',
        description: errorMessage,
        type: 'error',
      });
    }
  };

  const handleAccept = () => handleUpdateStatus('ACCEPTED');
  const handleNegotiate = () => handleUpdateStatus('PENDING');

  if (loading) {
        return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg font-semibold">Chargement du devis...</p>
          <p className="text-sm text-gray-600">Veuillez patienter.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

    if (!quote) {
    return null; // Ou un message indiquant que le devis n'est pas chargé
  }

  return (
        <div className="bg-gray-100 min-h-screen">
      <QuotePreview
        quoteData={{
          ...quote,
          products: quote.products.map((p: any) => ({ ...p, product: p.product }))
        }}
        onClose={() => { 
          // Rediriger ou afficher un message de confirmation
                              addToast({ title: 'Fermeture', description: 'Vous avez fermé l\'aperçu du devis.', type: 'info' });
        }}
        isClientView={true}
        onAccept={handleAccept}
        onNegotiate={handleNegotiate}
        quoteId={id}
        quoteStatus={quote.status}
        mode="view"
      />
    </div>
  )
}
