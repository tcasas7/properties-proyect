"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Property } from "../../../../shared/types/property";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    api.get("/properties").then((res) => {
      setProperties(res.data);
    });
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = form;

    const url = `https://wa.me/5492233005228?text=${encodeURIComponent(
      `¡Hola! 👋\n\nQuiero hacer una consulta:\n\nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}`
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
    <Header/>

    {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center text-center py-16 bg-[#ffe5f0]">
        <div className="relative z-10 px-6 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#4A7150] leading-tight mb-4">
            Encuentra tu próxima estadía de lujo
          </h1>
          <p className="text-lg md:text-xl text-[#4A7150]">
            Propiedades seleccionadas en Argentina y España
          </p>
        </div>
      </section>




    {/* Main content */}
<main className="w-full max-w-screen-xl mx-auto px-4 py-8 space-y-16">

  <section id="argentina">
    <h2 className="text-3xl font-bold text-center mb-6">Propiedades en Argentina</h2>
    <div className="flex flex-wrap justify-center gap-10">
      {argentina.map((prop) => (
        <PropertyCard key={prop.id} property={prop} />
      ))}
    </div>
  </section>

  <section id="espania">
    <h2 className="text-3xl font-bold text-center mb-6">Propiedades en España</h2>
    <div className="flex flex-wrap justify-center gap-10">
      {espana.map((prop) => (
        <PropertyCard key={prop.id} property={prop} />
      ))}
    </div>
  </section>

  <section className="bg-[#ffe5f0] text-[#4A7150] py-16 text-center rounded-xl">
    <h2 className="text-2xl font-bold mb-8">¿Por qué elegirnos?</h2>
    <div className="flex flex-col md:flex-row justify-center gap-10 px-4">
      <div className="max-w-sm">
        <p className="text-lg">🏡 Propiedades seleccionadas por su calidad y diseño.</p>
      </div>
      <div className="max-w-sm">
        <p className="text-lg">⭐ Atención personalizada con años de experiencia.</p>
      </div>
      <div className="max-w-sm">
        <p className="text-lg">🔒 Reserva segura y rápida desde nuestra plataforma.</p>
      </div>
    </div>
  </section>

  <section id="about" className="bg-[#ffe5f0] py-16 text-center rounded-xl shadow-sm text-[#4A7150]">
    <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
    <p className="max-w-3xl mx-auto text-lg leading-relaxed">
      En <span className="font-semibold">PremiumStays</span> nos especializamos en propiedades exclusivas
      de Argentina y España. Nuestro objetivo es ofrecer alojamientos seleccionados por su confort,
      ubicación y diseño. Somos una empresa familiar con años de experiencia en hospitalidad.
    </p>
  </section>

  <section id="contact" className="bg-[#ffe5f0] py-16 rounded-xl text-[#4A7150]">
    <div className="container mx-auto px-4 max-w-xl text-center">
      <h2 className="text-2xl font-bold mb-6">Contáctanos</h2>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded border border-[#4A7150] bg-white text-[#4A7150]"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded border border-[#4A7150] bg-white text-[#4A7150]"
        />
        <textarea
          name="message"
          placeholder="Mensaje"
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
          Enviar mensaje
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

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`} className="w-full max-w-[500px]">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:shadow-2xl hover:scale-[1.015] duration-300">
        {property.images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.images[0]}`}
            alt={property.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-1 text-[#4A7150]">{property.title}</h3>
          <p className="text-sm text-[#4A7150]">
            {property.location}
            {property.subtitle ? `  ${property.subtitle}` : ""}
          </p>
          <p className="text-[#4A7150] font-bold mt-2">${property.price}</p>
          <button className="mt-4 w-full bg-[#4A7150] text-[#FFE7EC] py-3 rounded-xl font-medium hover:bg-[#3a624e]">
            Ver detalles
          </button>
        </div>
      </div>
    </Link>
  );
}
}