'use client';

import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-brand-light text-brand-blue rounded-lg shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-blue hover:bg-brand-blue hover:text-brand-light rounded-full p-2 transition-all duration-300"
          aria-label="Fermer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 className="text-3xl md:text-4xl font-serif mb-6 text-brand-blue">Mentions Légales</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <div className="bg-white/50 p-4 rounded-lg">
            <p className="font-semibold text-brand-blue mb-2">Éditeur du site :</p>
            <p>Jordan Carter - THE BODY HEALER</p>
            <p>Adresse : [Adresse à compléter]</p>
            <p>Email : thebodyhealer81@gmail.com</p>
            <p>Numéro SIRET : [Numéro à compléter]</p>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <p className="font-semibold text-brand-blue mb-2">Hébergement :</p>
            <p>[Informations sur l&apos;hébergeur à compléter]</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif pt-4 text-brand-blue border-t-2 border-brand-gold/30 mt-6">Politique de Confidentialité</h3>
          <div className="bg-white/50 p-4 rounded-lg">
             <p className="mb-3">Jordan Carter utilise le prénom et l&apos;adresse e-mail saisis pour envoyer l&apos;e-book demandé. Le site enregistre la demande dans une base privée hébergée dans l&apos;Union européenne. Le prénom, l&apos;adresse e-mail et la date sont également transmis au tableau de suivi de Jordan hébergé par Google, lisible par les personnes qui disposent de son lien. Resend assure l&apos;envoi du mail.</p>
             <p>Les demandes d&apos;e-book sont conservées pendant 90 jours. Pour accéder à vos données, les faire rectifier ou les faire effacer, écrivez à thebodyhealer81@gmail.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
