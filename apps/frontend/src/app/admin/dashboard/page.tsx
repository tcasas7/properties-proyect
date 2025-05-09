/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Property } from '../../../../../../shared/types/property';

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: 0,
  });
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await api.get<Property[]>('/properties');
    setProperties(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('location', form.location);
    formData.append('price', String(form.price));

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });
    }

    await api.post('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setForm({ title: '', location: '', price: 0 });
    setFiles(null);
    fetchProperties();
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="location"
          placeholder="Ubicación"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear Propiedad
        </button>
      </form>

<div className="space-y-4">
  {properties.map((p) => {
    console.log('Imagenes propiedad:', p.images); // 👈 Esto te ayuda a ver los paths que vienen del backend
    return (
      <div key={p.id} className="border p-4 rounded bg-gray-100">
        <h3 className="font-semibold">{p.title}</h3>
        <p>{p.location}</p>
        <span className="text-sm text-gray-600">${p.price}</span>

        <div className="flex flex-wrap gap-2 mt-2">
          {p.images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${imgUrl}`}
              alt={`imagen-${idx}`}
              className="w-32 h-24 object-cover rounded"
            />
          ))}
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
}
