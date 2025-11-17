
import React from 'react';

const OptInForm: React.FC = () => {
  return (
    <form className="w-full max-w-md mt-6 space-y-4">
      <div>
        <label htmlFor="firstName" className="sr-only">Prénom</label>
        <input 
          type="text" 
          id="firstName"
          placeholder="Prénom"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-brand-beige focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
        />
      </div>
      <div>
        <label htmlFor="email" className="sr-only">Adresse e-mail</label>
        <input 
          type="email" 
          id="email"
          placeholder="Adresse e-mail"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-brand-beige focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-brand-gold text-brand-blue font-bold py-3 px-6 rounded-full transform hover:scale-105 transition-transform duration-300 shadow-lg"
      >
        Je veux recevoir l’e-book
      </button>
    </form>
  );
};

export default OptInForm;
