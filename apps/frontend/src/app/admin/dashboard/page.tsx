/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Property } from '../../../../../../shared/types/property';
import toast from 'react-hot-toast';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import CalendarManager from '@/components/CalendarManager'; 
import Link from 'next/link';


class FileListProxy {
  constructor(private files: File[]) {
    files.forEach((f, i) => (this[i] = f));
  }
  length = this.files.length;
  item = (i: number) => this.files[i];
  [index: number]: File;
  [Symbol.iterator]() {
    return this.files[Symbol.iterator]();
  }
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    location: '',
    price: 0,
    description: '',
    country: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const imageInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});
  const router = useRouter();
  
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await api.get<Property[]>('/properties');
    setProperties(res.data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('subtitle', form.subtitle);
    formData.append('location', form.location);
    formData.append('price', String(form.price));
    formData.append('description', form.description);
    formData.append('country', form.country);


    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      await api.post('/properties', formData);
      toast.success('Propiedad creada con éxito');
      setForm({ title: '', subtitle: '', location: '', price: 0, description: '', country: '' });
      setFiles(null);
      fetchProperties();
    } catch (err) {
      console.error(err);
      toast.error('Error al crear la propiedad');
    }
  };
    
  const handleLogout = () => {
  localStorage.removeItem('token');
  document.cookie = 'token=; Max-Age=0; path=/';
  router.push('/admin/login');
};

 return (
  <>
    <header className="w-full bg-[#ffe5f0] px-6 py-4 flex items-center justify-between shadow">
    
      <Link href="/">
        <button className="bg-[#4A7150] text-white px-4 py-2 rounded hover:bg-[#3a624e]">
          Home
        </button>
      </Link>

      <h1 className="text-2xl font-bold text-[#4A7150] text-center">
        Admin Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </header>
  <main className="p-6 space-y-8 bg-[#FFF1F2] min-h-screen">
      {/* Formulario de creación */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#ffe5f0] p-6 rounded-xl shadow">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Título" className="w-full p-2 border border-[#4A7150]/30 rounded focus:ring-[#4A7150] focus:border-[#4A7150]" required />
        <input
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="Subtítulo (ej: ideal para parejas, 3 personas)"
          className="w-full p-2 border border-[#4A7150]/30 rounded focus:ring-[#4A7150] focus:border-[#4A7150]"
        />
        {/*<input name="location" value={form.location} onChange={handleChange} placeholder="Ubicación" className="w-full p-2 border rounded" required />*/}
        <input
          name="price"
          type="text" 
          value={form.price === 0 ? '' : form.price} 
          onChange={(e) => {
            const value = e.target.value;
            setForm((prev) => ({
              ...prev,
              price: value === '' ? 0 : Number(value),
            }));
          }}
          placeholder="Precio"
          className="w-full p-2 border border-[#4A7150]/30 rounded focus:ring-[#4A7150] focus:border-[#4A7150]"
        />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" rows={4} />
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full p-2 border border-[#4A7150]/30 rounded bg-[#FFF1F2] text-[#4A7150] focus:ring-[#4A7150] focus:border-[#4A7150] appearance-none"
          required
        >
          <option value="">Seleccioná un país</option>
          <option value="Argentina">Argentina</option>
          <option value="España">España</option>
        </select>
        <div className="space-y-2">
          <label className="block font-semibold">Imágenes</label>
          {Array.from(files || []).map((file, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm">{file.name}</span>
              <button type="button" onClick={() => {
                const newFiles = Array.from(files!);
                newFiles.splice(i, 1);
                setFiles(new FileListProxy(newFiles));
              }} className="text-red-500 text-sm hover:underline">Quitar</button>
            </div>
          ))}
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setFiles(new FileListProxy([...(files ? Array.from(files) : []), file]));
          }} className="w-full p-2 border border-[#4A7150]/30 rounded focus:ring-[#4A7150] focus:border-[#4A7150]" />
        </div>
        <button
          type="submit"
          className="bg-[#4A7150] text-white px-4 py-2 rounded hover:bg-[#3a624e]"
        >
          Crear Propiedad
        </button>
        </form>
      {/* Lista de propiedades */}
      <div className="space-y-4">
        {properties.map((p) => (
          <div key={p.id} className="border p-4 rounded bg-[#ffe5f0] shadow-sm">
            <div className="flex justify-between items-start">
              {editingId === p.id ? (
                <div className="space-y-2 w-full">
                  <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full p-1 border rounded" />
                  <input
                    name="subtitle"
                    value={editForm.subtitle ?? ""}
                    onChange={handleEditChange}
                    placeholder="Subtítulo (ej: ideal para parejas, 3 personas)"
                    className="w-full p-2 border border-[#4A7150]/30 rounded focus:ring-[#4A7150] focus:border-[#4A7150]"
                  />
                 <input
                    name="price"
                    type="text"
                    value={editForm.price === 0 || editForm.price === undefined ? '' : editForm.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditForm((prev) => ({
                        ...prev,
                        price: value === '' ? 0 : Number(value),
                      }));
                    }}
                    className="w-full p-2 border border-[#4A7150]/30 rounded focus:ring-[#4A7150] focus:border-[#4A7150]"
                  />
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full p-1 border rounded" rows={3} />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const newFiles = e.target.files;
                      if (!newFiles?.length) return;

                      const formData = new FormData();
                      Array.from(newFiles).forEach((file) => formData.append('images', file));

                      try {
                        toast.loading('Agregando imagenes...');
                        await api.patch(`/properties/${p.id}/add-images`, formData);
                        toast.dismiss();
                        toast.success('Imágenes agregadas');
                        fetchProperties();
                      } catch {
                        toast.dismiss();
                        toast.error('Error al agregar imágenes');
                      }
                    }}
                    className="w-full p-2 border border-[#4A7150]/30 rounded focus:ring-[#4A7150] focus:border-[#4A7150]"
                  />

                  <div className="flex gap-2 mt-2">
                    <button onClick={async () => {
                      try {
                        toast.loading('Actualizando...');
                            await api.put(`/properties/${p.id}`, {
                          ...editForm,
                          subtitle: editForm.subtitle ?? "",});
                        toast.dismiss();
                        toast.success('Propiedad actualizada');
                        setEditingId(null);
                        fetchProperties();
                      } catch {
                        toast.dismiss();
                        toast.error('Error al actualizar');
                      }
                    }}className="bg-[#4A7150] text-white px-3 py-1 rounded text-sm hover:bg-[#3a624e]">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="text-red-500 text-sm hover:underline">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  {p.subtitle && (
                    <p className="text-sm italic text-gray-500">{p.subtitle}</p>
                  )}
                  <p className="text-sm text-gray-600">{p.description}</p>
                  <span className="text-sm text-gray-600">${p.price}</span>
                  <button
                    onClick={() => {
                      setEditingId(p.id);
                      setEditForm({
                        ...p,
                        subtitle: p.subtitle ?? "",
                      });
                    }}
                    className="mt-2 block text-[#4A7150] text-sm bg-[#FFD6E0] px-3 py-1 rounded hover:bg-[#e4717a]"
                    >
                     Editar
                  </button>

                </div>
              )}

              <button
                onClick={async () => {
                  if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
                    try {
                      toast.loading('Eliminando propiedad...');
                      await api.delete(`/properties/${p.id}`);
                      toast.dismiss();
                      toast.success('Propiedad eliminada');
                      fetchProperties();
                    } catch {
                      toast.dismiss();
                      toast.error('Error al eliminar');
                    }
                  }
                }}
                className="text-red-600 text-sm bg-red-100 px-3 py-1 rounded hover:bg-red-200"
              >
                Eliminar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {p.images.map((imgUrl, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${imgUrl}`}
                    alt={`imagen-${idx}`}
                    className="w-32 h-24 object-cover rounded cursor-pointer"
                    onClick={() => imageInputRefs.current[`${p.id}-${idx}`]?.click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { imageInputRefs.current[`${p.id}-${idx}`] = el; }}
                    onChange={async (e) => {
                      const newImage = e.target.files?.[0];
                      if (!newImage) return;
                      const formData = new FormData();
                      formData.append('image', newImage);
                      try {
                        toast.loading('Actualizando imagen...');
                        await api.patch(`/properties/${p.id}/replace-image/${idx}`, formData);
                        toast.dismiss();
                        toast.success('Imagen actualizada');
                        fetchProperties();
                      } catch {
                        toast.dismiss();
                        toast.error('Error al actualizar imagen');
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <CalendarManager propertyId={p.id} />
          </div>
        ))}
      </div>
    </main>
    </>
  );
}
