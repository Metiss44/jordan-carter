
import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-brand-light text-brand-blue rounded-lg shadow-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-blue hover:opacity-70"
          aria-label="Fermer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-3xl font-serif mb-6">Mentions Légales</h2>
        <div className="space-y-4 text-gray-700">
          <p><strong>Éditeur du site :</strong></p>
          <p>Jordan Carter - THE BODY HEALER</p>
          <p>Adresse : [Adresse à compléter]</p>
          <p>Email : thebodyhealer81@gmail.com</p>
          <p>Numéro SIRET : [Numéro à compléter]</p>
          <p><strong>Hébergement :</strong></p>
          <p>[Informations sur l'hébergeur à compléter]</p>
          <h3 className="text-2xl font-serif pt-4">Politique de Confidentialité</h3>
          <p>Les informations recueillies sur ce formulaire sont enregistrées dans un fichier informatisé par Jordan Carter pour la gestion de sa clientèle et l'envoi de communications.</p>
          <p>Elles sont conservées pendant [Durée à compléter] et sont destinées à Jordan Carter. Conformément à la loi « informatique et libertés », vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier en contactant : thebodyhealer81@gmail.com</p>
          <p>[... Plus de détails à compléter par le client ...]</p>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
