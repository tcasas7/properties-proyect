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
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "../../../../../../shared/types/calendar";
import { differenceInCalendarDays } from "date-fns";
import BookingCard from "@/components/BookingCard";
import { useLocale } from "@/context/LanguageContext";
import propertyTranslations from "@/translations/property";

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
  const { locale } = useLocale();
  const t = propertyTranslations[locale];

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

  if (!property) return (
  <div className="text-center py-10">
    {locale === "es" ? "Cargando propiedad..." : "Loading property..."}
  </div>
);

  const totalNights = startDate && endDate ? differenceInCalendarDays(endDate, startDate) : 0;
  const totalPrice = property.price * totalNights;

  const handleBooking = () => {
    if (!startDate || !endDate) return;
    const url = `https://wa.me/5492233005228?text=${encodeURIComponent(
      `Hola! Quiero reservar:\n\nPropiedad: ${property.title}\nUbicación: ${property.location}\nDesde: ${startDate.toLocaleDateString()}\nHasta: ${endDate.toLocaleDateString()}\nTotal (${totalNights} noches): $${totalPrice}`
    )}`;
    window.open(url, "_blank");
  };

  
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF1F2] text-[#4A7150]">
    <header className="sticky top-0 z-50 bg-[#fdcae1]/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-[#4A7150] hover:text-[#3a624e] transition"
            aria-label="Volver"
          >
            <ArrowLeft size={22} />
          </button>
          <span className="text-sm font-medium text-[#4A7150]">
            {locale === "es" ? "Volver" : "Back"}
          </span>
        </div>
        <span className="hover:text-[#3c5945]">PremiumStays</span>
      </div>
    </header>


      <main className="max-w-screen-xl mx-auto px-4 py-10 space-y-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4A7150] mb-1">
            {locale === "es" ? property.title : property.title_en}
          </h1>
          <p className="text-lg text-[#4A7150] font-medium mt-2">
            {locale === "es" ? property.subtitle : property.subtitle_en}
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
              {locale === "es" ? property.description : property.description_en}
            </p>
              {/* Precio destacado */}
              <p className="text-3xl font-bold text-[#4A7150] mb-2">
                 <span className="text-xl font-bold" style={{ color: '4A7150' }}>
                      ${property.price} / {locale === "es" ? t.night : t.night}
                    </span>
              </p>

              {/* Calendario */}
              <div className="space-y-6">
                <h3 className="font-semibold mb-3 text-[#4A7150] text-lg">{t.selectStay}</h3>
                <div className="flex justify-center">
                  <div className="bg-[#fefefe] p-6 rounded-2xl shadow-md border w-full max-w-md">
                    <BookingCard
                      disabledDates={disabledDates}
                      onSelectRange={({ startDate, endDate }) => {
                        setStartDate(startDate);
                        setEndDate(endDate);
                      }}
                    />
                  </div>
                </div>
                {/* Total */}
                {startDate && endDate && (
                  <div className="text-md mt-4 text-[#4A7150] font-medium">
                    {totalNights}{" "}
                    {totalNights === 1 ? t.night : t.nights} · {t.total}{" "}
                    <span className="text-xl font-bold" style={{ color: '4A7150' }}>
                      ${totalPrice} USD
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Botón */}
            <Button
              disabled={!startDate || !endDate}
              onClick={handleBooking}
              className="mt-5 w-full bg-[#4A7150] text-[#FFE7EC] py-6 text-xl rounded-2xl font-semibold hover:bg-[#3a624e] transition-all duration-200"
            >
              {t.bookWhatsApp}
            </Button>
          </div>
          
        </div>

      {property.latitude && property.longitude && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-[#4A7150]">{t.mapTitle}</h3>
          <iframe
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
          ></iframe>
          {/* Dirección abajo del mapa */}
          <p className="text-lg font-semibold mb-4 text-[#4A7150] mt-4">
            
            {t.addressLabel} {property.location}
          </p>
        </div>
      )}


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
