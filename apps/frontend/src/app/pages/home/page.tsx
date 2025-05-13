"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Property } from "../../../../../../shared/types/property";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);

useEffect(() => {
  api.get("/properties").then((res) => {
    console.log("Propiedades cargadas:", res.data);
    setProperties(res.data);
  });
}, []);


    const argentina = properties.filter((p) => p.country === "Argentina");
    const espana = properties.filter((p) => p.country === "España");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto text-center text-2xl font-bold">
          Propiedades Premium
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-blue-800">Argentina</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {argentina.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-blue-800">España</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {espana.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
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
    <div className="bg-white rounded shadow p-4 transition hover:shadow-lg">
      {property.images.length > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.images[0]}`}
          alt="Imagen propiedad"
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{property.location}</p>
      <p className="text-sm text-gray-800">{property.description}</p>
      <div className="mt-2 font-bold text-blue-600">${property.price}</div>
    </div>
  );
}