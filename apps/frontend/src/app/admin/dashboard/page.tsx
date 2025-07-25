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
import { confirmDialog } from '@/components/ConfrimDialog';
import { jwtDecode }  from 'jwt-decode';
import { geocodeAddress } from '@/lib/geocode';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const now = Date.now().valueOf() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({
    title: '',
    title_en: '',
    subtitle: '',
    subtitle_en: '',
    location: '',
    latitude: 0,
    longitude: 0,
    price: 0,
    description: '',
    description_en: '',
    country: '',
    address: '',
    order: 0,
  });
  const [files, setFiles] = useState<File[]>([]);
  const imageInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});
  const router = useRouter();
  const [isEditMode] = useState(false);

  
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await api.get<Property[]>('/properties');
    setProperties(res.data);
  };

    useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      router.push('/admin/login');
    }
  }, [router]);

useEffect(() => {
  if (!form.address || !isEditMode) return;

  const delay = setTimeout(() => {
    geocodeAddress(form.address)
      .then(({ lat, lng }) => {
        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      })
      .catch((err) => {
        console.warn("No se pudo obtener la ubicación automáticamente:", err.message);
      });
  }, 700);

  return () => clearTimeout(delay);
}, [form.address, isEditMode]);


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

  try {
    let uploadedUrls: string[] = [];

    if (files && files.length > 0) {
      const uploads = Array.from(files).map((file) => uploadToCloudinary(file));
      uploadedUrls = await Promise.all(uploads);
    }

    const payload = {
      title: form.title,
      title_en: form.title_en,
      subtitle: form.subtitle,
      subtitle_en: form.subtitle_en,
      location: form.location,
      latitude: form.latitude,
      longitude: form.longitude,
      price: form.price,
      description: form.description,
      description_en: form.description_en,
      country: form.country,
      order: form.order,
      images: uploadedUrls,
    };

    await api.post('/properties', payload);

    toast.success('Propiedad creada con éxito');
    setForm({
      title: '',
      subtitle: '',
      location: '',
      price: 0,
      description: '',
      country: '',
      latitude: 0,
      longitude: 0,
      title_en: '',
      subtitle_en: '',
      description_en: '',
      address: '',
      order: 0,
    });
    setFiles([]);
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
<header className="w-full bg-[#66B2D6]/80 px-4 py-4 shadow">
  <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-0 md:hidden">
    <h1 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg text-center mt-2 md:mt-0">
      Admin Dashboard
    </h1>
    <div className="flex gap-3 w-full justify-center md:justify-start">
      <Link href="/">
        <button className="bg-[#1A5E8D] text-[#EAF7FC] px-4 py-1.5 rounded-full text-sm font-medium shadow hover:bg-[#154a72] transition">
          Home
        </button>
      </Link>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>
  </div>    
</div>
  <div className="hidden md:flex items-center justify-between">
    <Link href="/">
      <button className="bg-[#1A5E8D] text-[#EAF7FC] px-5 py-2 rounded-full text-base font-medium shadow hover:bg-[#154a72] transition">
        Home
      </button>
    </Link>

    <h1 className="text-white text-2xl font-bold drop-shadow-lg text-center">
      Admin Dashboard
    </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>
</div>
    </header>
  <main className="p-6 space-y-8 bg-[#A8D8E8] min-h-screen">

      {/* Formulario de creación */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Título" className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D] bg-white text-[#1A5E8D] placeholder-[#1A5E8D]/50" required />
        <input
          name="title_en"
          value={form.title_en}
          onChange={handleChange}
          placeholder="Title in English"
          className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D] bg-white text-[#1A5E8D] placeholder-[#1A5E8D]/50"
        />  
        <input
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="Subtítulo (ej: ideal para parejas, 3 personas)"
          className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D] bg-white text-[#1A5E8D] placeholder-[#1A5E8D]/50"
        />
        <input
          name="subtitle_en"
          value={form.subtitle_en}
          onChange={handleChange}
          placeholder="Subtitle in English"
          className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D] bg-white text-[#1A5E8D] placeholder-[#1A5E8D]/50"
        />
        {/*<input name="location" value={form.location} onChange={handleChange} placeholder="Ubicación" className="w-full p-2 border rounded" required />*/}
        <input
          name="price"
          type="text" 
          step="0.01"
          value={Number.isFinite(form.price) ? form.price : ''}
          onChange={(e) => {
            const value = e.target.value;
            setForm((prev) => ({
              ...prev,
              price: value === '' ? 0 : Number(value),
            }));
          }}
          placeholder="Precio"
          className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
        />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" rows={4} />
        <textarea
          name="description_en"
          value={form.description_en}
          onChange={handleChange}
          placeholder="Description in English"
          className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
          rows={6}
        />
        <select
          name="order"
          value={form.order}
          onChange={handleChange}
          className="w-full p-2 border border-[#1A5E8D]/30 rounded bg-white text-[#1A5E8D] focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
        >
          <option value={0}>Altos de Colón</option>
          <option value={1}>Altos de Alsina</option>
        </select>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Ubicación / Dirección"
          className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
        />
        <div className="space-y-2">
          <label className="block font-semibold">Imágenes</label>

          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm text-ellipsis overflow-hidden">{file.name}</span>
              <button
                type="button"
                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                className="text-red-500 text-sm hover:underline"
              >
                Quitar
              </button>
            </div>
          ))}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFiles((prev) => [...prev, file]);
            }}
            className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1A5E8D] text-white px-4 py-2 rounded hover:bg-[#154a72]"
        >
          Crear Propiedad
        </button>
        </form>
      {/* Lista de propiedades */}
      <div className="space-y-4">
        {properties.map((p) => (
          <div key={p.id} className="border p-4 rounded bg-white shadow-sm">
            <div className="flex justify-between items-start">
              {editingId === p.id ? (
                <div className="space-y-2 w-full">
                  <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full p-1 border rounded" />
                  <input
                    name="title_en"
                    value={editForm.title_en ?? ""}
                    onChange={handleEditChange}
                    className="w-full p-1 border rounded"
                  />
                  <input
                    name="subtitle"
                    value={editForm.subtitle ?? ""}
                    onChange={handleEditChange}
                    placeholder="Subtítulo (ej: ideal para parejas, 3 personas)"
                   className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D] bg-white text-[#1A5E8D] placeholder-[#1A5E8D]/50"
                  />
                  <input
                    name="subtitle_en"
                    value={editForm.subtitle_en ?? ""}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D] bg-white text-[#1A5E8D] placeholder-[#1A5E8D]/50"
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
                    className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
                    rows={8}
                  />
                  <textarea
                    name="description_en"
                    value={editForm.description_en ?? ""}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
                    rows={8}
                  />
                  <select
                    name="order"
                    value={editForm.order ?? 0}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditForm((prev) => ({
                        ...prev,
                        order: Number(value),
                      }));
                    }}
                    className="w-full p-2 border border-[#1A5E8D]/30 rounded bg-white text-[#1A5E8D] focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
                  >
                    <option value={0}>Altos de Colón</option>
                    <option value={1}>Altos de Alsina</option>
                  </select>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const newFiles = e.target.files;
                      if (!newFiles?.length) return;
                      try {
                        toast.loading('Subiendo imágenes...');
                        const urls = await Promise.all(Array.from(newFiles).map(uploadToCloudinary));
                        await api.patch(`/properties/${p.id}/add-images`, { images: urls });
                        toast.dismiss();
                        toast.success('Imágenes agregadas');
                        fetchProperties();
                      } catch {
                        toast.dismiss();
                        toast.error('Error al agregar imágenes');
                      }
                    }}
                    className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
                  />

                  <input
                  name="location"
                  value={editForm.location ?? ''}
                  onChange={handleEditChange}
                  placeholder="Ubicación / Dirección"
                  className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
                />
                <input
                  name="latitude"
                  type="text"
                  value={editForm.latitude == null ? '' : editForm.latitude}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditForm((prev) => ({
                      ...prev,
                      latitude: value === '' ? undefined : Number(value),
                    }));
                  }}
                  placeholder="Latitud (opcional)"
                  className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
                />

                <input
                  name="longitude"
                  type="text"
                  value={editForm.longitude == null ? '' : editForm.longitude}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditForm((prev) => ({
                      ...prev,
                      longitude: value === '' ? undefined : Number(value),
                    }));
                  }}
                  placeholder="Longitud (opcional)"
                  className="w-full p-2 border border-[#1A5E8D]/30 rounded focus:ring-[#1A5E8D] focus:border-[#1A5E8D]"
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
                    }}className="bg-[#154a72] text-white px-3 py-1 rounded text-sm hover:bg-[#154a72]">Guardar</button>
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
                        subtitle_en: p.subtitle_en ?? "",
                        latitude: undefined,
                        longitude: undefined,

                      });
                    }}
                    className="mt-2 block text-white text-sm bg-[#1A5E8D] px-3 py-1 rounded hover:bg-[#154a72]"
                    >
                     Editar
                  </button>

                </div>
              )}
              <button
                onClick={async () => {
                  const confirmed = await confirmDialog({
                    message: '¿Estás seguro de eliminar esta propiedad?',
                    confirmLabel: 'Eliminar',
                    cancelLabel: 'Cancelar',
                  });

                  if (confirmed) {
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
                    src={imgUrl}
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
                    try {
                      toast.loading('Subiendo imagen...');
                      const url = await uploadToCloudinary(newImage);
                      await api.patch(`/properties/${p.id}/replace-image/${idx}`, { image: url });
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
