export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'MiProyectoPropiedades/1.0 (tomas.casas7@hotmail.com)',
    },
  });
  const data = await res.json();
  if (data.length === 0) {
    throw new Error('No se pudo geocodificar la dirección');
  }
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
