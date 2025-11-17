
import React from 'react';
import { BookOpenIcon, SparklesIcon, SunIcon, HeartIcon, HomeIcon } from './Icons';

const benefits = [
  { icon: <HeartIcon />, text: "Comment reconnaître les signaux que ton corps t’envoie quand quelque chose n’est plus aligné." },
  { icon: <SparklesIcon />, text: "Des exercices de respiration consciente (breathwork) pour calmer ton système nerveux." },
  { icon: <SunIcon />, text: "Un rituel de grounding / earthing pour t’ancrer grâce au contact avec la nature." },
  { icon: <BookOpenIcon />, text: "Des pratiques de présence au corps pour apaiser le mental et revenir à toi." },
  { icon: <HomeIcon />, text: "Des pistes pour créer ton propre espace sacré, même dans un quotidien chargé." },
];

const EbookBenefits: React.FC = () => {
  return (
    <section id="ebook" className="py-20 bg-brand-blue">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Ce que tu trouveras dans l’e-book que je t’offre</h2>
        <p className="max-w-3xl mx-auto text-lg text-brand-green-gray mb-12">
          J’ai créé cet e-book comme une première porte d’entrée vers mon univers. Tu vas y découvrir des clés simples pour commencer à te reconnecter à ton corps dès maintenant.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-lg border border-white/10 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="text-brand-gold w-10 h-10 mb-4">{benefit.icon}</div>
              <p className="text-brand-beige">{benefit.text}</p>
            </div>
          ))}
           <div className="sm:col-span-2 lg:col-span-1 flex items-center justify-center bg-white/5 p-6 rounded-lg border border-white/10">
             <a href="#ebook-form" className="text-brand-gold text-lg text-center hover:underline">
               Reçois ton e-book gratuitement en laissant ton e-mail.
             </a>
           </div>
        </div>
      </div>
    </section>
  );
};

export default EbookBenefits;
