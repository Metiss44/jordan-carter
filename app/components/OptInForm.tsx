'use client';

import React, { useState } from 'react';

const OptInForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/send-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        console.error('Send error', data);
        alert("Une erreur est survenue lors de l'envoi — réessaie plus tard.");
      } else {
        // succès
        setFirstName('');
        setEmail('');
        alert('Merci ! Un lien pour télécharger l\'e-book vient de t\'être envoyé 📧');
      }
    } catch (err) {
      console.error(err);
      alert("Impossible d'envoyer l'e-mail pour le moment. Réessaie plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mt-6 space-y-4">
      <div className="relative group">
        <label htmlFor="firstName" className="sr-only">Prénom</label>
        <input 
          type="text" 
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          required
          className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-brand-beige focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all backdrop-blur-sm group-hover:border-white/30"
        />
      </div>
      <div className="relative group">
        <label htmlFor="email" className="sr-only">Adresse e-mail</label>
        <input 
          type="email" 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          required
          className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-brand-beige focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all backdrop-blur-sm group-hover:border-white/30"
        />
      </div>
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-blue font-bold py-3 px-6 rounded-full transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-brand-gold/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
      >
        <span className="relative z-10">
          {isSubmitting ? 'Envoi en cours...' : 'Je veux recevoir l\'e-book'}
        </span>
        <span className="absolute inset-0 bg-shimmer animate-shimmer"></span>
      </button>
    </form>
  );
};

export default OptInForm;
