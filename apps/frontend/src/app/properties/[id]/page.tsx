/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Property } from "../../../../../../shared/types/property";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { ArrowLeft } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "../../../../../../shared/types/calendar";
import { differenceInCalendarDays, format } from "date-fns";
import BookingCard from "@/components/BookingCard";
import { useLocale } from "@/context/LanguageContext";
import propertyTranslations from "@/translations/property";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GalleryModal from "@/components/GalleryModal";


interface SeasonalPrice {
  id: number;
  propertyId: number;
  startDate: string;
  endDate: string;
  price: number;
}

export default function PropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [seasonalPrices, setSeasonalPrices] = useState<SeasonalPrice[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    galleryOpen
      ? {
          loop: true,
          slideChanged: (s) => setSelectedIndex(s.track.details.rel),
        }
      : undefined
  );

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
      api.get<SeasonalPrice[]>(`/properties/${id}/seasonal-prices`).then(res => {
        setSeasonalPrices(res.data);
  });

    }
  }, [id]);

  useEffect(() => {
  if (galleryOpen && instanceRef.current) {
    instanceRef.current.moveToIdx(selectedIndex);
  }
}, [galleryOpen, instanceRef, selectedIndex]);


  useEffect(() => {
    document.body.style.overflow = galleryOpen ? "hidden" : "";
  }, [galleryOpen]);

  if (!property) return (
  <div className="text-center py-10">
    {locale === "es" ? "Cargando propiedad..." : "Loading property..."}
  </div>
);

  const totalNights = startDate && endDate ? differenceInCalendarDays(endDate, startDate) : 0;
  
  
  const handleBooking = () => {
    if (!startDate || !endDate) return;
    const { total } = calculateTotal();
    const url = `https://wa.me/+5492235247372?text=${encodeURIComponent(
      `Hola! Quiero reservar:\n\nPropiedad: ${property.title}\nUbicación: ${property.location}\nDesde: ${startDate.toLocaleDateString()}\nHasta: ${endDate.toLocaleDateString()}\nTotal (${totalNights} noches):$${total}`
    )}`;
    window.open(url, "_blank");
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return { original: 0, breakdown: [], total: 0 };

    let remaining = new Date(startDate);
    const baseRate = property.price;
    const breakdown: { date: Date; rate: number }[] = [];

    while (remaining < endDate) {
      const next = new Date(remaining);
      next.setDate(next.getDate() + 1);
      const enterDate = new Date(remaining);

      const custom = seasonalPrices.find(sp =>
        new Date(sp.startDate) <= enterDate && enterDate < new Date(sp.endDate)
      );
      const rate = custom?.price ?? baseRate;
      breakdown.push({ date: new Date(enterDate), rate });
      remaining = next;
    }

    const total = breakdown.reduce((sum, seg) => sum + seg.rate, 0);
    return { baseRate, breakdown, total };
  };

  const { baseRate, breakdown, total } = calculateTotal();


  return (
    <div className="min-h-screen flex flex-col bg-[#A8D8E8] text-2xl font mb-1 text-[#1A5E8D]">
    <header className="sticky top-0 z-50 bg-[#66B2D6]/80 backdrop-blur-md shadow">
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-3 text-sm font-bold text-white drop-shadow-md">
          <button
            onClick={() => router.push("/")}
            className="hover:text-[#1A5E8D] transition"
            aria-label="Volver"
          >
            <ArrowLeft size={22} />
          </button>
          <span className="text-sm font-medium">
            {locale === "es" ? "Volver" : "Back"}
          </span>
        </div>
        <span className="font-bold hover:text-[#1A5E8D] text-white drop-shadow-md transition">
          PremiumStays
        </span>
      </div>
    </header>

      <main className="max-w-screen-xl mx-auto px-4 py-10 space-y-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-1 text-[#1A5E8D]">
            {locale === "es" ? property.title : property.title_en}
          </h1>
          <p className="text-2xl text-white drop-shadow-lg font-bold mt-2">
            {locale === "es" ? property.subtitle : property.subtitle_en}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3s gap-8">
          <div className="md:col-span-2 space-y-4">
<div
  className="relative aspect-video rounded-2xl overflow-hidden shadow-lg cursor-pointer"
  onClick={() => {
    setSelectedIndex(0);
    setGalleryOpen(true);
  }}
>
  <Image
    src={property.images[0]}
    alt={property.title}
    key={galleryOpen ? `open-${selectedIndex}` : "closed"}
    fill
    className="object-cover"
    priority
  />
</div>

            {property.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {property.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
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
              <p className="text-3xl text-[#1A5E8D] font-bold mb-2">
                 <span className="text-xl font-bold" style={{ color: '1A5E8D' }}>
                      ${property.price} / {locale === "es" ? t.night : t.night}
                    </span>
              </p>

              {/* Calendario */}
              <div className="space-y-6">
                <h3 className="font-semibold mb-3 text-[#1A5E8D] text-lg">{t.selectStay}</h3>
                <div className="flex justify-center">
                  <div className="bg-[#fefefe] p-6 rounded-2xl shadow-md border w-full max-w-md">
                  <BookingCard
                    disabledDates={disabledDates}
                    seasonalPrices={seasonalPrices || []}
                    onSelectRange={({ startDate, endDate }) => {
                      setStartDate(startDate);
                      setEndDate(endDate);
                    }}
                  />
                  </div>
                </div>
                {/* Total */}
                  {startDate && endDate && totalNights > 0 && (
                    <div className="mt-4 text-[#1A5E8D] font-medium">
                  <p className="text-md">
                    {locale === "es"
                      ? `Estadía del ${format(startDate, "dd/MM/yyyy")} al ${format(endDate, "dd/MM/yyyy")} · ${totalNights} noche(s)`
                      : `Stay from ${format(startDate, "dd/MM/yyyy")} to ${format(endDate, "dd/MM/yyyy")} · ${totalNights} night(s)`}
                  </p>

                      {breakdown.some(b => b.rate !== baseRate) ? (
                        <>
                          <ul className="mt-2 space-y-1 list-disc list-inside">
                            {(() => {
                              const groups: { start: Date; end: Date; rate: number }[] = [];
                              breakdown.forEach((b) => {
                                const prev = groups[groups.length - 1];
                                if (
                                  !prev ||
                                  prev.rate !== b.rate ||
                                  +b.date !== +prev.end
                                ) {
                                  groups.push({
                                    start: b.date,
                                    end: new Date(b.date.getTime() + 86400000),
                                    rate: b.rate,
                                  });
                                } else {
                                  prev.end = new Date(b.date.getTime() + 86400000);
                                }
                              });

                              return groups.map((g, i) => (
                                <li key={i}>
                                  ${g.rate} x {differenceInCalendarDays(g.end, g.start)} noche(s) ({format(g.start, "dd/MM/yyyy")} al {format(new Date(g.end.getTime() - 86400000), "dd/MM/yyyy")})
                                </li>
                              ));
                            })()}
                          </ul>
                          <p className="mt-2 font-semibold">Total: ${total} USD</p>
                        </>
                      ) : (
                        <p className="mt-2 font-semibold">Total: ${total} USD</p>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Botón */}
              <Button disabled={!startDate || !endDate} onClick={handleBooking} className="mt-5 w-full bg-[#1A5E8D] text-[#EAF7FC] py-6 text-xl rounded-2xl font-semibold hover:bg-[#154a72] transition-all duration-200">
                {t.bookWhatsApp}
              </Button>
            </div>
            
          </div>

      {property.latitude && property.longitude && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-[#1A5E8D]">{t.mapTitle}</h3>
          <iframe
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
          ></iframe>
          {/* Dirección abajo del mapa */}
          <p className="text-lg font-semibold mb-4 text-[#1A5E8D] mt-4">
            {t.addressLabel} {property.location}
          </p>
        </div>
      )}


      </main>

  {galleryOpen && property.images.length > 0 && (
  <GalleryModal
    images={property.images}
    selectedIndex={selectedIndex}
    onClose={() => setGalleryOpen(false)}
    onNavigate={(index) => setSelectedIndex(index)}
  />
)}
    </div>
  );
}
