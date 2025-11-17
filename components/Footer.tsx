
import React from 'react';
import { InstagramIcon, FacebookIcon } from './Icons';

interface FooterProps {
  onLegalClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLegalClick }) => {
  return (
    <footer className="bg-[#101c24] text-brand-beige py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-semibold text-white mb-2">Jordan Carter — THE BODY HEALER</h4>
            <a href="mailto:thebodyhealer81@gmail.com" className="hover:text-white transition-colors">thebodyhealer81@gmail.com</a>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <a href="#" aria-label="Instagram" className="text-brand-beige hover:text-white transition-colors">
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Facebook" className="text-brand-beige hover:text-white transition-colors">
              <FacebookIcon className="w-6 h-6" />
            </a>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <button onClick={onLegalClick} className="hover:text-white transition-colors">Mentions légales</button>
            <button onClick={onLegalClick} className="hover:text-white transition-colors">Politique de confidentialité</button>
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
