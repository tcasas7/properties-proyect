"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Property } from "../../../../../../shared/types/property";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight, X, ArrowLeft } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "../../../../../../shared/types/calendar";
import { differenceInCalendarDays } from "date-fns";

export default function PropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged: (s) => setSelectedIndex(s.track.details.rel),
  });

  useEffect(() => {
    if (id) {
      api.get(`/properties/${id}`).then((res) => {
        setProperty(res.data);
      });
      api.get<Calendar[]>(`/calendar/${id}`).then((res) => {
        const dates = res.data.map((d) => new Date(d.date));
        setDisabledDates(dates);
      });
    }
  }, [id]);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.moveToIdx(selectedIndex);
    }
  }, [instanceRef, selectedIndex]);

  useEffect(() => {
    document.body.style.overflow = galleryOpen ? "hidden" : "";
  }, [galleryOpen]);

  if (!property) return <div className="text-center py-10">Cargando propiedad...</div>;

  const totalNights = startDate && endDate ? differenceInCalendarDays(endDate, startDate) : 0;
  const totalPrice = property.price * totalNights;

  const handleBooking = () => {
    if (!startDate || !endDate) return;
    const url = `https://wa.me/5492233005228?text=${encodeURIComponent(
      `Hola! 👋 Quiero reservar:\n\nPropiedad: ${property.title}\nUbicación: ${property.location}\nDesde: ${startDate.toLocaleDateString()}\nHasta: ${endDate.toLocaleDateString()}\nTotal (${totalNights} noches): $${totalPrice}`
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF1F2] text-[#4A7150]">
    <header className="sticky top-0 z-50 bg-[url('/images/pastel.jpg')] bg-cover border-b shadow-sm px-4 py-4 flex items-center gap-4">
      <button onClick={() => router.push("/")} className="text-[#4A7150]-600 hover:text-pink-700">
        <ArrowLeft size={24} />
      </button>
      <span className="text-sm font-medium text-[#4A7150]">Volver</span>
    </header>

      <main className="max-w-screen-xl mx-auto px-4 py-10 space-y-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4A7150] mb-1">{property.title}</h1>
          <p className="text-sm text-gray-500">
            {property.location}
            {property.subtitle ? ` - ${property.subtitle}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3s gap-8">
          <div className="md:col-span-2 space-y-4">
            <div
              className="aspect-video rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => {
                setSelectedIndex(0);
                setGalleryOpen(true);
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.images[0]}`}
                alt={property.title}
                width={1200}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {property.images.map((img, i) => (
                  <Image
                    key={i}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${img}`}
                    alt={`img-${i}`}
                    width={120}
                    height={80}
                    onClick={() => {
                      setSelectedIndex(i);
                      setGalleryOpen(true);
                    }}
                    className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between space-y-6 p-6 bg-white rounded-2xl shadow-md border">
            <div>
   <p className="text-lg leading-relaxed mb-6 whitespace-pre-line">
      {property.description}
    </p>
              <p className="text-2x1 font-semibold text-pink-600 mb-4">
                ${property.price} / noche
              </p>

              <div>
                <h3 className="font-semibold mb-2">Seleccioná tu estadía</h3>
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    const [start, end] = dates as [Date, Date];
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  excludeDates={disabledDates}
                  className="rounded-md"
                />

                {startDate && endDate && (
                  <div className="text-sm mt-2 text-gray-700">
                    {totalNights} noche(s) · Total:
                    <span className="font-semibold text-pink-600"> ${totalPrice} USD</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              disabled={!startDate || !endDate}
              onClick={handleBooking}
              className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white w-full py-3 text-lg rounded-xl"
            >
              Reservar vía WhatsApp
            </Button>
          </div>
        </div>
      </main>

      {galleryOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white z-50"
            onClick={() => setGalleryOpen(false)}
          >
            <X size={32} />
          </button>

          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full"
          >
            <ChevronRight size={32} />
          </button>

          <div ref={sliderRef} className="keen-slider w-full h-full">
            {property.images.map((img, i) => (
              <div
                className="keen-slider__slide flex items-center justify-center w-full h-full"
                key={i}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${img}`}
                    alt={`img-${i}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
