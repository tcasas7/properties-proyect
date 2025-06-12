"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Property } from "../../../../shared/types/property";
import Link from "next/link";
import { useLocale } from "@/context/LanguageContext";
import { Header } from "@/components/Header";
import Image from "next/image";


export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { locale } = useLocale(); 

  useEffect(() => {
    api.get("/properties").then((res) => {
      setProperties(res.data);
    });
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = form;

    const url = `https://wa.me/5492233005228?text=${encodeURIComponent(
      `¡Hola! \n\nQuiero hacer una consulta:\n\nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}`
    )}`;

    window.open(url, "_blank");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const argentina = properties.filter((p) => p.country === "Argentina");
  const espana = properties.filter((p) => p.country === "España");

return (
  <div className="min-h-screen flex flex-col bg-[#FFF1F2] text-[#4A7150]">
    <Header />

<section className="relative w-full h-[500px] sm:h-[600px] flex items-center justify-center 
  bg-gradient-to-r from-[#ffe5f0] via-[#f8d9e6] to-[#fff4f8] overflow-hidden ">
  
  <Image
    src="/images/panomarica.jpg"
    alt="Imagen de fondo"
    fill={true}
    className="object-cover opacity-10" 
    priority
  />

 
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
    <h1 className="text-4xl md:text-6xl font-bold text-[#4A7150] mb-6 tracking-normal leading-snug">
      {locale === "es"
        ? "Encuentra tu próxima estadía de lujo"
        : "Find your next luxury stay"}
    </h1>

    <p className="text-lg md:text-xl text-[#4A7150]/90 mb-6">
      {locale === "es"
        ? "Propiedades seleccionadas en Argentina y España"
        : "Selected properties in Argentina and Spain"}
    </p>

    <button
      onClick={() =>
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
      }
      className="bg-[#4A7150] text-white px-6 py-3 rounded-full text-lg font-medium shadow hover:bg-[#3a624e] transition"
    >
      {locale === "es" ? "Contáctanos" : "Contact Us"}
    </button>
  </div>
</section>


  <main className="w-full max-w-screen-xl mx-auto px-4 py-8 space-y-16">

  <section id="argentina">
    <h2 className="text-3xl font-bold text-center mb-6">{locale === "es" ? "Propiedades en Argentina" : "Properties in Argentina"}</h2>
    <div className="flex flex-wrap justify-center gap-10">
      {argentina.map((prop) => (
        <PropertyCard key={prop.id} property={prop} locale={locale} />
      ))}
    </div>
  </section>

  <section id="espania">
    <h2 className="text-3xl font-bold text-center mb-6">{locale === "es" ? "Propiedades en España" : "Properties in Spain"}</h2>
    <div className="flex flex-wrap justify-center gap-10">
      {espana.map((prop) => (
        <PropertyCard key={prop.id} property={prop} locale={locale}/>
      ))}
    </div>
  </section>

  <section className="bg-[#ffe5f0] text-[#4A7150] py-16 text-center rounded-xl">
    <h2 className="text-3xl font-bold text-center mb-6">{locale === "es" ? "¿Por qué elegirnos?" : "Why choose us?"}</h2>
    <div className="flex flex-col md:flex-row justify-center gap-10 px-4">
      <div className="max-w-sm">
        <p className="text-lg font mb-8"> {locale === "es"
                  ? "🏡 Propiedades seleccionadas por su calidad y diseño."
                  : "🏡 Properties selected for their quality and design."}</p>
      </div>
      <div className="max-w-sm">
        <p className="text-lg font mb-8"> {locale === "es"
                  ? "⭐ Atención personalizada con años de experiencia."
                  : "⭐ Personalized attention with years of experience."}</p>
      </div>
      <div className="max-w-sm">
        <p className="text-lg font mb-8">   {locale === "es"
                  ? "🔒 Reserva segura y rápida desde nuestra plataforma."
                  : "🔒 Secure and fast booking from our platform."}</p>
      </div>
    </div>
  </section>

  <section id="about" className="bg-[#ffe5f0] py-16 text-center rounded-xl shadow-sm text-[#4A7150]">
    <h2 className="text-3xl font-bold text-center mb-6">{locale === "es" ? "Sobre Nosotros" : "About Us"}</h2>
    <p className="text-lg font mb-8">
      {locale === "es" ? (
            <>
               En <span className="font-semibold">PremiumStays</span> nos especializamos en propiedades exclusivas de Argentina y España.
               Nuestro objetivo es ofrecer alojamientos seleccionados por su confort, ubicación y diseño.
              Somos una empresa familiar con años de experiencia en hospitalidad.
            </>
           ) : (
             <>
              At <span className="font-semibold">PremiumStays</span> we specialize in exclusive properties from Argentina and Spain.
              Our goal is to offer accommodations selected for their comfort, location, and design.
              We are a family business with years of experience in hospitality.
            </>
           )}
    </p>
  </section>

  <section id="contact" className="bg-[#ffe5f0] py-16 rounded-xl text-[#4A7150]">
    <div className="container mx-auto px-4 max-w-xl text-center">
      <h2 className="text-3xl font-bold text-center mb-6">{locale === "es" ? "Contáctanos" : "Contact Us"}</h2>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder={locale === "es" ? "Nombre" : "Name"}
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded border border-[#4A7150] bg-white text-[#4A7150]"
        />
        <input
          type="email"
          name="email"
          placeholder={locale === "es" ? "Correo electrónico" : "Email"}
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded border border-[#4A7150] bg-white text-[#4A7150]"
        />
        <textarea
          name="message"
          placeholder={locale === "es" ? "Mensaje" : "Message"}
          rows={4}
          value={form.message}
          onChange={handleChange}
          required
          className="w-full p-3 rounded border border-[#4A7150] bg-white text-[#4A7150]"
        />
        <button
          type="submit"
          className="w-full bg-[#4A7150] text-white py-3 rounded font-semibold hover:bg-[#3b5d42] transition"
        >
          {locale === "es" ? "Enviar mensaje" : "Send Message"}
        </button>
      </form>
    </div>
  </section>
</main>


    <footer className="bg-white text-[#4A7150] py-6 border-t text-center text-sm">
      © 2025 Propiedades Premium
    </footer>
  </div>
);

function PropertyCard({ property, locale }: { property: Property; locale: "es" | "en" }) {
  return (
    <Link href={`/properties/${property.id}`} className="w-full max-w-[500px]">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:shadow-2xl hover:scale-[1.015] duration-300">
        {property.images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.images[0]}`}
            alt={locale === "es" ? property.title : property.title_en}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-1 text-[#4A7150]">{locale === "es" ? property.title : property.title_en}</h3>
          <p className="text-lg text-[#4A7150]">
            {locale === "es" ? property.subtitle : property.subtitle_en}
          </p>
          <p className="text-[#4A7150] font-bold mt-2">${property.price}</p>
          <button className="mt-4 w-full bg-[#4A7150] text-[#FFE7EC] py-3 rounded-xl font-medium hover:bg-[#3a624e]">
            {locale === "es" ? "Ver detalles" : "View Details"}
          </button>
        </div>
      </div>
    </Link>
  );
}
}