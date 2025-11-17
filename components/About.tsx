
import React from 'react';
import { CheckCircleIcon } from './Icons';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#14232e]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 flex justify-center">
            <img 
              src="https://cdn.the-body-healer.com/photo-carter-2.webp" 
              alt="Jordan Carter" 
              className="rounded-lg shadow-2xl w-full max-w-sm border-2 border-brand-gold/20"
            />
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Je m’appelle Jordan, et j’accompagne les corps qui ont besoin de se sentir entendus.
            </h2>
            <div className="space-y-4 text-brand-green-gray text-lg">
              <p>
                Pendant des années, j’ai moi-même vécu dans un corps tendu, en pilote automatique. C’est en découvrant les soins énergétiques, la respiration consciente et le contact à la nature que j’ai commencé à entendre ce que mon corps avait à me dire.
              </p>
              <p>
                Aujourd’hui, j’accompagne les personnes qui se sentent épuisées, déconnectées, stressées ou simplement en quête de sens, à revenir à elles grâce à des pratiques simples, profondes et accessibles.
              </p>
              <p>
                Mon approche est douce, non intrusive, et toujours centrée sur ce que tu ressens ici et maintenant. Je ne te demande pas de croire à quoi que ce soit : je t’invite à expérimenter par toi-même.
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-brand-beige mb-4">En séance, je t’aide à :</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                  <span>relâcher les tensions émotionnelles et physiques accumulées,</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                  <span>revenir dans ton corps grâce à la respiration et au mouvement,</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                  <span>poser des mots sur ce que tu traverses, sans jugement,</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                  <span>repartir avec des rituels simples à refaire chez toi.</span>
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
