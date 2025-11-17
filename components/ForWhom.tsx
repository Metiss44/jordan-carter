
import React from 'react';
import { CheckCircleIcon } from './Icons';

const ForWhom: React.FC = () => {
  return (
    <section id="for-whom" className="py-20 bg-[#14232e]">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Est-ce que je suis la bonne personne pour t’accompagner ?</h2>
          <p className="max-w-3xl mx-auto text-lg text-brand-green-gray mb-12">
            Je ne propose pas des solutions miracles, je t’ouvre un espace pour que tu puisses te rencontrer autrement. Mon accompagnement s’adresse particulièrement à toi si…
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-serif text-brand-beige mb-6">Tu te reconnais peut-être si…</h3>
            <ul className="space-y-3">
              <ListItem text="tu te sens souvent épuisé(e), tendu(e) ou à fleur de peau," />
              <ListItem text="tu as l’impression d’être coupé(e) de ton corps, de vivre surtout dans ta tête," />
              <ListItem text="tu as du mal à te poser, à ralentir, à respirer consciemment," />
              <ListItem text="tu sens que quelque chose doit changer, mais tu ne sais pas par où commencer." />
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-serif text-brand-beige mb-6">Tu aimerais…</h3>
            <ul className="space-y-3">
              <ListItem text="retrouver plus de calme intérieur," />
              <ListItem text="mieux comprendre tes émotions et tes réactions corporelles," />
              <ListItem text="renouer avec ton intuition," />
              <ListItem text="t’offrir un espace rien qu’à toi, où tu peux déposer ce que tu traverses." />
            </ul>
          </div>
        </div>
        <p className="text-center mt-12 text-md text-brand-green-gray italic max-w-3xl mx-auto">
          Tu n’as pas besoin d’avoir déjà pratiqué la méditation, le yoga ou les soins énergétiques : je t’accompagne étape par étape.
        </p>
      </div>
    </section>
  );
};

const ListItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start">
    <CheckCircleIcon className="h-5 w-5 text-brand-gold mr-3 mt-1 flex-shrink-0" />
    <span className="text-brand-green-gray">{text}</span>
  </li>
);

export default ForWhom;
