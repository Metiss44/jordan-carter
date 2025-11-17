'use client';

import React from 'react';
import { InstagramIcon, FacebookIcon } from './Icons';

interface FooterProps {
  onLegalClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLegalClick }) => {
  return (
    <footer className="bg-[#101c24] text-brand-beige py-12 border-t border-brand-gold/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-semibold text-white mb-2 font-serif text-xl">Jordan Carter — THE BODY HEALER</h4>
            <a href="mailto:thebodyhealer81@gmail.com" className="hover:text-brand-gold transition-colors inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              thebodyhealer81@gmail.com
            </a>
          </div>
          <div className="flex justify-center items-center space-x-6">
            <a 
              href="https://instagram.com/theb0dyhealer" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @theb0dyhealer" 
              className="text-brand-beige hover:text-brand-gold transition-all duration-300 transform hover:scale-110"
            >
              <InstagramIcon className="w-7 h-7" />
            </a>
            <a 
              href="https://facebook.com/theb0dyhealer" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook theb0dyhealer" 
              className="text-brand-beige hover:text-brand-gold transition-all duration-300 transform hover:scale-110"
            >
              <FacebookIcon className="w-7 h-7" />
            </a>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-2">
            <button onClick={onLegalClick} className="hover:text-brand-gold transition-colors">Mentions légales</button>
            <button onClick={onLegalClick} className="hover:text-brand-gold transition-colors">Politique de confidentialité</button>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-brand-green-gray/70">
          <p>© {new Date().getFullYear()} THE BODY HEALER — Jordan Carter. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
