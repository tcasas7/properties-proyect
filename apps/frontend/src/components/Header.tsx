"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [locale, setLocale] = useState<"es" | "en">("es");

  const switchLanguage = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-700">
          PremiumStays
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#about" className="hover:text-blue-600 transition">Sobre Nosotros</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contacto</a>
          <button onClick={switchLanguage} className="hover:text-blue-600 transition">
            {locale === "es" ? "EN" : "ES"}
          </button>
        </nav>
      </div>
    </header>
  );
}
