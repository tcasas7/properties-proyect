'use client';

import { useLocale } from "@/context/LanguageContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { locale, switchLocale } = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#66B2D6]/80 backdrop-blur-md shadow">
      <div className="w-full px-4 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="text-white text-lg font-bold hover:text-[#1A5E8D] transition drop-shadow-md">
          PremiumStays
        </Link>

      
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-white drop-shadow-md">
          <a href="#about" className="hover:underline hover:text-[#1A5E8D] transition">
            {locale === "es" ? "Sobre Nosotros" : "About Us"}
          </a>
          <a href="#contact" className="hover:underline hover:text-[#1A5E8D] transition">
            {locale === "es" ? "Contacto" : "Contact"}
          </a>
          <button
            onClick={switchLocale}
            className="hover:underline hover:text-[#1A5E8D] transition"
          >
            {locale === "es" ? "EN" : "ES"}
          </button>
        </nav>

        
        <button
          className="md:hidden text-white drop-shadow-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      
      {isMenuOpen && (
        <div className="md:hidden bg-[#66B2D6] px-6 py-6 flex flex-col gap-4 text-white font-semibold drop-shadow-lg">
          <a
            href="#about"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-[#1A5E8D] transition"
          >
            {locale === "es" ? "Sobre Nosotros" : "About Us"}
          </a>
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-[#1A5E8D] transition"
          >
            {locale === "es" ? "Contacto" : "Contact"}
          </a>
          <button
            onClick={() => {
              switchLocale();
              setIsMenuOpen(false);
            }}
            className="text-left hover:text-[#1A5E8D] transition"
          >
            {locale === "es" ? "English" : "Español"}
          </button>
        </div>
      )}
    </header>
  );
}
