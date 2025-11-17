
import React from 'react';
import OptInForm from './OptInForm';

const FinalCTA: React.FC = () => {
  return (
    <section id="final-cta" className="py-20 bg-[#14232e]">
      <div className="container mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
          Tu sens que ton corps te parle déjà ?
        </h2>
        <p className="max-w-xl text-lg text-brand-green-gray mb-8">
          Laisse-moi t’accompagner pour écouter ce qu’il a à te dire. Commence par recevoir l’e-book gratuit.
        </p>
        <div id="contact" className="w-full max-w-md">
            <OptInForm />
            <p className="text-xs text-brand-green-gray/70 mt-3">
              Je respecte ton rythme et ta confidentialité. Tu peux te désinscrire en un clic à tout moment.
            </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
