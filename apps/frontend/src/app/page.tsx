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

    const url = `https://wa.me/+5492235247372?text=${encodeURIComponent(
      `¡Hola! \n\nQuiero hacer una consulta:\n\nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}`
    )}`;

    window.open(url, "_blank");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const altosDeColon = properties.find((p) => p.order === 0);
  const altosDeAlsina = properties.find((p) => p.order === 1);

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
        ? "Encuentra tu próxima estadía en Mar del Plata"
        : "Find your next stay in Mar del Plata"}
    </h1>

    <p className="text-base md:text-4xl text-white/90 drop-shadow-2xl mb-4">
      {locale === "es"
        ? "PROPIEDADES ZONA CENTRO - GUEMES"
        : "Properties - Downtown & Güemes Area"}
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
          <div className="flex justify-center gap-8 flex-wrap">
            {altosDeColon && (
              <div className="flex flex-col items-center w-full max-w-[600px]">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 drop-shadow-lg">
                  {locale === "es" ? "ALTOS DE COLON" : "UPPER COLON"}
                </h2>
                <PropertyCard property={altosDeColon} locale={locale} />
              </div>
            )}

            {altosDeAlsina && (
              <div className="flex flex-col items-center w-full max-w-[600px]">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 drop-shadow-lg">
                  {locale === "es" ? "ALTOS DE ALSINA" : "UPPER ALSINA"}
                </h2>
                <PropertyCard property={altosDeAlsina} locale={locale} />
              </div>
            )}
          </div>
        </section>

  <section className="bg-[#66B2D6] text-white py-16 px-4 mb-6 drop-shadow-lg rounded-xl">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 drop-shadow-md">
      {locale === "es" ? "¿Por qué elegirnos?" : "Why choose us?"}
    </h2>

    <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
      {[
        {
          es: {
            title: "Experiencia comprobada",
            desc: "Elegir nuestros departamentos entre muchos anuncios similares es apostar por un servicio que lleva años funcionando con éxito.",
          },
          en: {
            title: "Proven Experience",
            desc: "Choosing our apartments among many listings means trusting a service that has been running successfully for years.",
          },
        },
        {
          es: {
            title: "Atención personalizada",
            desc: "Nos encanta brindar un trato directo y humano, para que puedas alquilar con total confianza.",
          },
          en: {
            title: "Personalized Attention",
            desc: "We love offering direct, human interaction so you can rent with complete confidence.",
          },
        },
        {
          es: {
            title: "Gestión directa, sin intermediarios",
            desc: "Somos los propietarios, por lo que nos ocupamos personalmente antes, durante y después de tu estancia.",
          },
          en: {
            title: "Direct Management, No Middlemen",
            desc: "We are the owners, personally taking care of everything before, during, and after your stay.",
          },
        },
        {
          es: {
            title: "Ubicación estratégica",
            desc: "Nuestras propiedades están ubicadas en zonas clave para una estadía placentera y cómoda.",
          },
          en: {
            title: "Strategic Location",
            desc: "Our properties are located in key areas to ensure a pleasant and comfortable stay.",
          },
        },
        {
          es: {
            title: "Reserva simple y segura",
            desc: "El proceso es transparente y fácil, para que solo te concentres en disfrutar tu viaje.",
          },
          en: {
            title: "Simple & Secure Booking",
            desc: "The process is transparent and easy, so you can focus solely on enjoying your trip.",
          },
        },
      ].map((item, idx) => (
<div key={idx} className="flex gap-4 items-start">
  <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center rounded-full bg-white text-[#66B2D6] font-bold text-base shadow-md">
    {idx + 1}
  </div>
  <div className="flex-1">
    <h3 className="text-xl font-bold mb-1 drop-shadow-sm">
      {locale === "es" ? item.es.title : item.en.title}
    </h3>
    <p className="text-base drop-shadow-sm leading-relaxed sm:text-justify max-w-prose">
      {locale === "es" ? item.es.desc : item.en.desc}
    </p>
  </div>
</div>

      ))}
    </div>
  </section>


 <section id="about" className="bg-[#66B2D6] text-white py-16 px-4 mb-6 drop-shadow-lg rounded-xl">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 drop-shadow-md">
    {locale === "es" ? "Sobre Nosotros" : "About Us"}
  </h2>

  <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
    {[
      {
        es: {
          title: "Transparencia y honestidad",
          desc: "Creemos en la importancia de los pequeños detalles, en la transparencia y en la honestidad a la hora de gestionar cada reserva.",
        },
        en: {
          title: "Transparency and Honesty",
          desc: "We believe in the importance of small details, transparency, and honesty when managing each booking.",
        },
        icon: "💬",
      },
      {
        es: {
          title: "Atención cercana",
          desc: "El equipo de alquiler vacacional está siempre disponible para resolver dudas, recomendar actividades y facilitar el proceso de reserva.",
        },
        en: {
          title: "Close Support",
          desc: "Our vacation rental team is always available to answer questions, suggest activities, and simplify the booking process.",
        },
        icon: "📞",
      },
      {
        es: {
          title: "Compromiso con la calidad",
          desc: "Nuestras propiedades cumplen con altos estándares de limpieza y puntualidad con los horarios de entrada y salida.",
        },
        en: {
          title: "Commitment to Quality",
          desc: "Our properties meet high standards of cleanliness and punctuality at check-in and check-out times.",
        },
        icon: "🧼",
      },
      {
        es: {
          title: "Pasión por la hospitalidad",
          desc: "Somos un equipo apasionado por los viajes, la hospitalidad y el bienestar de quienes buscan un espacio confortable y acogedor donde descansar.",
        },
        en: {
          title: "Passion for Hospitality",
          desc: "We’re a team passionate about travel, hospitality, and the well-being of those seeking a cozy and comfortable place to rest.",
        },
        icon: "🏡",
      },
    ].map((item, idx) => (
      <div key={idx} className="flex gap-4 items-start">
        <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center rounded-full bg-white text-[#66B2D6] text-xl shadow-md">
          {item.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1 drop-shadow-sm">
            {locale === "es" ? item.es.title : item.en.title}
          </h3>
    <p className="text-base drop-shadow-sm leading-relaxed sm:text-justify max-w-prose">
      {locale === "es" ? item.es.desc : item.en.desc}
    </p>
        </div>
      </div>
    ))}
  </div>
</section>


  <section id="contact" className="bg-[#66B2D6] py-16 rounded-xl text-white mb-6 drop-shadow-lg">
    <div className="container mx-auto px-4 max-w-2xl text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 drop-shadow-md">
        {locale === "es" ? "Contáctanos" : "Contact Us"}
      </h2>

      <form onSubmit={handleContactSubmit} className="space-y-5 text-left">
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold drop-shadow-sm">
            {locale === "es" ? "Nombre" : "Name"}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={locale === "es" ? "Tu nombre" : "Your name"}
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-[#2f2c79] bg-white text-[#2f2c79] shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold drop-shadow-sm">
            {locale === "es" ? "Correo electrónico" : "Email"}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={locale === "es" ? "Tu correo electrónico" : "Your email"}
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-[#2f2c79] bg-white text-[#2f2c79] shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-1 font-semibold drop-shadow-sm">
            {locale === "es" ? "Mensaje" : "Message"}
          </label>
          <textarea
            id="message"
            name="message"
            placeholder={locale === "es" ? "Escribe tu mensaje..." : "Write your message..."}
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-[#2f2c79] bg-white text-[#2f2c79] shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#1A5E8D] text-[#EAF7FC] py-3 rounded-xl font-semibold hover:bg-[#154a72] transition shadow-md"
        >
          {locale === "es" ? "Enviar mensaje" : "Send Message"}
        </button>
      </form>
    </div>
  </section>
  </main>

  </div>
);

function PropertyCard({ property, locale }: { property: Property; locale: "es" | "en" }) {
  return (
    <Link href={`/properties/${property.id}`} className="w-full max-w-[600px]">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:shadow-2xl hover:scale-[1.015] duration-300">
        {property.images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
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