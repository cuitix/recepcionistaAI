import React from 'react';
import { UtensilsCrossed, Phone } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary text-white shadow-md sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
            <UtensilsCrossed size={24} className="text-brand-secondary" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wide">PATIO FUNES</h1>
            <p className="text-xs text-brand-secondary font-sans tracking-wider uppercase">Reservas & Consultas</p>
          </div>
        </div>
        <a 
          href="https://wa.me/5491131804595" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full text-xs border border-white/10"
        >
          <Phone size={14} className="text-brand-secondary" />
          <span>11 3180-4595</span>
        </a>
      </div>
    </header>
  );
};