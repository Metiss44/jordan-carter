'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircleIcon } from './Icons';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#14232e] to-brand-blue relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 flex justify-center animate-fade-in">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-gold/20 to-transparent rounded-lg blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <Image 
                src="https://cdn.the-body-healer.com/photo-carter-2.webp" 
                alt="Jordan Carter" 
                width={400}
                height={500}
                className="relative rounded-lg shadow-2xl w-full max-w-sm border-2 border-brand-gold/20 group-hover:border-brand-gold/40 transition-all duration-300"
              />
            </div>
          </div>
          <div className="lg:col-span-3 space-y-6 animate-slide-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight">
              Je m&apos;appelle Jordan, et j&apos;accompagne les corps qui ont besoin de 
              <span className="text-brand-gold"> se sentir entendus</span>.
            </h2>
            <div className="space-y-4 text-brand-green-gray text-lg leading-relaxed">
              <p className="border-l-4 border-brand-gold/50 pl-4 py-2 bg-white/5 rounded-r-lg">
                Pendant des années, j&apos;ai moi-même vécu dans un corps tendu, en pilote automatique. C&apos;est en découvrant les soins énergétiques, la respiration consciente et le contact à la nature que j&apos;ai commencé à entendre ce que mon corps avait à me dire.
              </p>
              <p>
                Aujourd&apos;hui, j&apos;accompagne les personnes qui se sentent épuisées, déconnectées, stressées ou simplement en quête de sens, à revenir à elles grâce à des pratiques simples, profondes et accessibles.
              </p>
              <p>
                Mon approche est douce, non intrusive, et toujours centrée sur ce que tu ressens ici et maintenant. Je ne te demande pas de croire à quoi que ce soit : je t&apos;invite à expérimenter par toi-même.
              </p>
            </div>
            <div className="mt-8 bg-white/5 p-6 rounded-lg border border-brand-gold/20 backdrop-blur-sm">
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-brand-gold mb-4">En séance, je t&apos;aide à :</h3>
              <ul className="space-y-3">
                <li className="flex items-start group">
                  <CheckCircleIcon className="h-6 w-6 text-brand-gold mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">relâcher les tensions émotionnelles et physiques accumulées,</span>
                </li>
                <li className="flex items-start group">
                  <CheckCircleIcon className="h-6 w-6 text-brand-gold mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">revenir dans ton corps grâce à la respiration et au mouvement,</span>
                </li>
                <li className="flex items-start group">
                  <CheckCircleIcon className="h-6 w-6 text-brand-gold mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">poser des mots sur ce que tu traverses, sans jugement,</span>
                </li>
                <li className="flex items-start group">
                  <CheckCircleIcon className="h-6 w-6 text-brand-gold mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">repartir avec des rituels simples à refaire chez toi.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
