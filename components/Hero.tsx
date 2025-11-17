
import React from 'react';
import OptInForm from './OptInForm';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="container mx-auto px-6 py-16 md:py-24 min-h-screen flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text and Form Column */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="text-sm font-light tracking-widest text-brand-beige uppercase">THE BODY HEALER — JORDAN CARTER</span>
          <h1 className="text-4xl md:text-6xl font-serif text-white my-4 leading-tight">
            Reconnecte-toi à ton corps, apaise ton esprit.
          </h1>
          <p className="text-lg text-brand-green-gray max-w-xl mb-4">
            Je t’aide à écouter les messages de ton corps pour apaiser ton esprit, libérer les tensions et retrouver un ancrage profond dans ta vie.
          </p>
          <p className="text-md text-brand-beige max-w-xl">
            Pour t’accompagner sur ce chemin, je t’offre un e-book dans lequel je partage ma vision des soins énergétiques, de la respiration consciente et des rituels simples à intégrer à ton quotidien.
          </p>
          <div id="ebook-form" className="w-full max-w-md">
            <OptInForm />
            <p className="text-xs text-brand-green-gray/70 mt-3">
              En t’inscrivant, tu recevras l’e-book par e-mail et quelques messages pour t’aider à approfondir ta pratique. Tu peux te désinscrire à tout moment.
            </p>
          </div>
        </div>

        {/* Visuals Column */}
        <div className="relative flex justify-center items-center p-8">
          <img 
            src="https://cdn.the-body-healer.com/mockup-ebook-3d.webp" 
            alt="Mockup de l'e-book The Body Healer" 
            className="w-2/3 md:w-3/4 max-w-sm transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out"
          />
          <img 
            src="https://cdn.the-body-healer.com/photo-carter-1.webp" 
            alt="Jordan Carter" 
            className="absolute -bottom-4 -right-4 md:bottom-0 md:right-0 w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-2xl ring-4 ring-offset-4 ring-offset-brand-blue ring-brand-gold/50"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
