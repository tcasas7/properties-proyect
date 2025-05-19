"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Property } from "../../../../shared/types/property";
import Link from "next/link";
import { Header } from "@/components/Header"; // Nuevo Header con scroll


export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    api.get("/properties").then((res) => {
      console.log("Propiedades cargadas:", res.data);
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
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main content */}
      <main className="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-20 bg-gradient-to-b from-white via-blue-50 to-white">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Encuentra tu próxima estadía de lujo</h1>
          <p className="text-lg text-gray-600">Explora propiedades exclusivas en Argentina y España</p>
        </div>

        {/* Propiedades Argentina */}
        <section id="argentina">
          <h2 className="text-3xl font-bold text-center mt-16 mb-10 text-blue-800">
            Propiedades en Argentina
          </h2>
          <div className="flex flex-wrap justify-center gap-10 px-8">
            {argentina.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </section>

        {/* Propiedades España */}
        <section id="espania">
          <h2 className="text-3xl font-bold text-center mt-16 mb-10 text-blue-800">
            Propiedades en España
          </h2>
          <div className="flex flex-wrap justify-center gap-10 px-8">
            {espana.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section id="about" className="bg-white py-16 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Sobre Nosotros</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            En <span className="font-semibold">PremiumStays</span> nos especializamos en propiedades exclusivas 
            de Argentina y España. Nuestro objetivo es ofrecer alojamientos seleccionados por su confort, 
            ubicación y diseño. Somos una empresa familiar con años de experiencia en hospitalidad.
          </p>
        </section>

        {/* Contacto */}
        <section id="contact" className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Contáctanos</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded border"
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded border"
              />
              <textarea
                name="message"
                placeholder="Mensaje"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full p-3 rounded border"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="text-center">© 2025 Propiedades Premium</div>
      </footer>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`} className="w-[400px]">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:shadow-2xl">
        {property.images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.images[0]}`}
            alt={property.title}
            className="w-full h-52 object-cover"
          />
        )}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-1 text-gray-900">{property.title}</h3>
          <p className="text-sm text-gray-600">
            {property.location}
            {property.subtitle ? `  ${property.subtitle}` : ""}
          </p>
          <p className="text-blue-700 font-bold mt-2">${property.price}</p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700">
            Ver detalles
          </button>
        </div>
      </div>
    </Link>
  );
}
