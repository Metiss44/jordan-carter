'use client';

import React from 'react';
import Image from 'next/image';
import OptInForm from './OptInForm';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-light to-brand-blue opacity-90"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-6 py-12 md:py-16 lg:py-20 flex items-center relative z-10 max-w-7xl min-h-[75vh] md:min-h-[85vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
          {/* Text and Form Column */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-xs md:text-sm font-light tracking-widest text-brand-gold uppercase backdrop-blur-sm">
              THE BODY HEALER — JORDAN CARTER
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
              Reconnecte-toi à <span className="md:inline block">ton corps,</span> 
              <span className="block mt-2 text-brand-gold">Apaise ton esprit.</span>
            </h1>
            <p className="text-sm md:text-lg text-brand-green-gray leading-relaxed">
              Je t&apos;aide à écouter les messages de ton corps pour libérer les tensions, retrouver un ancrage profond et intégrer des rituels simples à ton quotidien grâce aux soins énergétiques et à la respiration consciente.
            </p>
            <div id="ebook-form" className="w-full max-w-lg pt-2">
              <OptInForm />
              <p className="text-xs text-brand-green-gray/70 mt-3 text-center lg:text-left">
                En t&apos;inscrivant, tu recevras l&apos;e-book par e-mail et quelques messages pour t&apos;aider à approfondir ta pratique. Tu peux te désinscrire à tout moment.
              </p>
            </div>
          </div>

          {/* Visuals Column */}
          <div className="relative flex justify-center items-center p-4 md:p-8 animate-slide-up">
            <div className="relative w-full md:w-3/4 max-w-sm">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand-gold/20 blur-2xl rounded-lg"></div>
              <Image 
                src="https://cdn.the-body-healer.com/mockup-ebook-3d.webp" 
                alt="Mockup de l'e-book The Body Healer" 
                width={400}
                height={500}
                className="relative transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out hover:scale-105"
                priority
              />
            </div>
            <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56">
                {/* Ring glow effect */}
                <div className="absolute inset-0 bg-brand-gold/30 rounded-full blur-lg"></div>
                <Image 
                  src="https://cdn.the-body-healer.com/photo-carter-1.webp" 
                  alt="Jordan Carter" 
                  width={224}
                  height={224}
                  className="relative rounded-full shadow-2xl ring-2 md:ring-4 ring-offset-2 md:ring-offset-4 ring-offset-brand-blue ring-brand-gold/50 object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
