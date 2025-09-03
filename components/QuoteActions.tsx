'use client';

import { useState } from 'react';
import { sendQuoteActionNotification } from '@/lib/notifications';

interface QuoteActionsProps {
  quoteId: string;
  clientEmail: string;
  onActionComplete?: (action: 'accepted' | 'negotiated') => void;
}

export default function QuoteActions({ quoteId, clientEmail, onActionComplete }: QuoteActionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAction = async (action: 'accepted' | 'negotiated') => {
    setIsLoading(action);
    setMessage(null);

    try {
      await sendQuoteActionNotification(quoteId, clientEmail, action);
      
      setMessage({
        type: 'success',
        text: action === 'accepted' 
          ? 'Devis accepté ! L\'administrateur a été notifié.' 
          : 'Demande de négociation envoyée ! L\'administrateur a été notifié.'
      });

      // Appeler le callback si fourni
      onActionComplete?.(action);

    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erreur lors de l\'envoi de la notification. Veuillez réessayer.'
      });
      console.error('Erreur:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Boutons d'action */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleAction('accepted')}
          disabled={isLoading !== null}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {isLoading === 'accepted' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Envoi...
            </>
          ) : (
            <>
              ✅ Accepter
            </>
          )}
        </button>

        <button
          onClick={() => handleAction('negotiated')}
          disabled={isLoading !== null}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {isLoading === 'negotiated' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Envoi...
            </>
          ) : (
            <>
              💬 Négocier
            </>
          )}
        </button>
      </div>

      {/* Message de feedback */}
      {message && (
        <div className={`p-3 rounded-lg text-center ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
