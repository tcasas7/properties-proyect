"use client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { useEffect } from "react";

interface Props {
  images: string[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function GalleryModal({
  images,
  selectedIndex,
  onClose,
  onNavigate,
}: Props) {
  const handlers = useSwipeable({
    onSwipedLeft: () => onNavigate((selectedIndex + 1) % images.length),
    onSwipedRight: () =>
      onNavigate((selectedIndex - 1 + images.length) % images.length),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      {...handlers}
    >
      {/* Cerrar */}
      <button
        className="absolute top-4 right-4 text-white z-50"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <X size={32} />
      </button>

      {/* Anterior */}
      <button
        className="absolute left-4 text-white z-50"
        onClick={() =>
          onNavigate((selectedIndex - 1 + images.length) % images.length)
        }
      >
        <ChevronLeft size={32} />
      </button>

      {/* Imagen */}
      <img
        src={images[selectedIndex]}
        alt={`img-${selectedIndex}`}
        className="max-h-[90vh] max-w-[95vw] object-contain mx-auto"
      />

      {/* Siguiente */}
      <button
        className="absolute right-4 text-white z-50"
        onClick={() => onNavigate((selectedIndex + 1) % images.length)}
      >
        <ChevronRight size={32} />
      </button>

      {/* Contador estilo Airbnb */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-50">
        {selectedIndex + 1} / {images.length}
      </div>
    </div>
  );
}
