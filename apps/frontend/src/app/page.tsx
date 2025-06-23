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
  //const espana = properties.filter((p) => p.country === "España");

return (
  <div className="min-h-screen flex flex-col bg-[#A8D8E8] text-white drop-shadow-2xl">
    <Header />

<section className="relative w-full h-[250px] sm:h-[300px] flex items-center justify-center 
  bg-gradient-to-r from-[#A8D8E8] via-[#66B2D6] to-[#3194C6] overflow-hidden">

  <Image
    src="/images/oceano.jpg"
    alt="Imagen de fondo"
    fill={true}
    className="object-cover opacity-40"
    priority
  />

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
    <h1 className="text-2xl md:text-5xl font-bold text-white drop-shadow-2xl mb-3 tracking-normal leading-snug">
      {locale === "es"
        ? "Encontrá tu próxima estadía de lujo"
        : "Find your next luxury stay"}
    </h1>

    <p className="text-base md:text-2xl text-white/90 drop-shadow-2xl mb-4">
      {locale === "es"
        ? "Propiedades seleccionadas en Mar del Plata"
        : "Selected properties in Mar del Plata"}
    </p>

    <button
      onClick={() =>
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
      }
      className="bg-[#1A5E8D] text-[#EAF7FC] px-5 py-2 rounded-full text-base font-medium shadow hover:bg-[#154a72] transition"
    >
      {locale === "es" ? "Contáctanos" : "Contact Us"}
    </button>
  </div>
</section>



  <main className="w-full max-w-screen-xl mx-auto px-4 py-8 space-y-16">

  <section id="argentina">
    <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg">{locale === "es" ? "Propiedades en Mar del Plata" : "Properties in Mar del Plata"}</h2>
    <div className="flex flex-wrap justify-center gap-10">
      {argentina.map((prop) => (
        <PropertyCard key={prop.id} property={prop} locale={locale} />
      ))}
    </div>
  </section>



  <section className="bg-[#66B2D6] text-white py-16 font text-center mb-6 drop-shadow-lg rounded-xl">
    <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg ">{locale === "es" ? "¿Por qué elegirnos?" : "Why choose us?"}</h2>
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

  <section id="about" className="bg-[#66B2D6] py-16 font text-center mb-6 drop-shadow-lg rounded-xl">
    <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg rounded-xl">{locale === "es" ? "Sobre Nosotros" : "About Us"}</h2>
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

  <section id="contact" className="bg-[#66B2D6] py-16 rounded-xl text-white mb-6 drop-shadow-lg">
    <div className="container mx-auto px-4 max-w-xl text-center">
      <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg">{locale === "es" ? "Contáctanos" : "Contact Us"}</h2>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder={locale === "es" ? "Nombre" : "Name"}
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded border border-[#2f2c79] bg-white text-[#2f2c79]"
        />
        <input
          type="email"
          name="email"
          placeholder={locale === "es" ? "Correo electrónico" : "Email"}
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded border border-[#2f2c79] bg-white text-[#2f2c79]"
        />
        <textarea
          name="message"
          placeholder={locale === "es" ? "Mensaje" : "Message"}
          rows={4}
          value={form.message}
          onChange={handleChange}
          required
          className="w-full p-3 rounded border border-[#2f2c79] bg-white text-[#2f2c79]"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-[#1A5E8D] text-[#EAF7FC] py-3 rounded-xl font-medium hover:bg-[#154a72] transition"
        >
          {locale === "es" ? "Enviar mensaje" : "Send Message"}
        </button>
      </form>
    </div>
  </section>
</main>


    <footer className="bg-white text-[#2f2c79] py-6 border-t text-center text-sm">
      © 2025 Propiedades Premium
    </footer>
  </div>
);

function PropertyCard({ property, locale }: { property: Property; locale: "es" | "en" }) {
  return (
    <Link href={`/properties/${property.id}`} className="w-full max-w-[600px]">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:shadow-2xl hover:scale-[1.015] duration-300">
        {property.images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.images[0]}`}
            alt={locale === "es" ? property.title : property.title_en}
            className="w-full h-70 object-cover"
          />
        )}
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-1 text-[#1A5E8D]">{locale === "es" ? property.title : property.title_en}</h3>
          <p className="text-lg text-[#3194C6]">
            {locale === "es" ? property.subtitle : property.subtitle_en}
          </p>
          <p className="text-[#1A5E8D] font-bold mt-2">${property.price}/noche</p>
          <button className="mt-4 w-full bg-[#1A5E8D] text-[#EAF7FC] py-3 rounded-xl font-medium hover:bg-[#154a72] transition">
            {locale === "es" ? "Ver detalles" : "View Details"}
          </button>
        </div>
      </div>
    </Link>
  );
}
}