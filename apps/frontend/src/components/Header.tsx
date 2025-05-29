"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [locale, setLocale] = useState<"es" | "en">("es");

  const switchLanguage = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fdcae1]/80 backdrop-blur-md shadow">
      <div className="backdrop-brightness-110 backdrop-blur-sm w-full px-4 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="hover:text-[#3c5945]">
          PremiumStays
        </Link>
        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A7150]">
          <a href="#about" className="hover:underline hover:text-[#3a624e] transition">Sobre Nosotros</a>
          <a href="#contact" className="hover:underline hover:text-[#3a624e] transition">Contacto</a>
          <button onClick={switchLanguage} className="hover:underline hover:text-[#3a624e] transition">
            {locale === "es" ? "EN" : "ES"}
          </button>
        </nav>
      </div>
    </header>
  );
}
