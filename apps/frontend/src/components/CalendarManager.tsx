import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '@/lib/api';
import type { Calendar as CalendarType } from '../../../../shared/types/calendar';

interface Props {
  propertyId: number;
  pricePerNight?: number; // si querés usarlo para cálculo
}

export default function CalendarManager({ propertyId, pricePerNight }: Props) {
  const [dates, setDates] = useState<CalendarType[]>([]);
  const [range, setRange] = useState<[Date, Date] | null>(null);

  useEffect(() => {
    fetchDates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDates = async () => {
    try {
      const res = await api.get<CalendarType[]>(`/calendar/${propertyId}`);
      setDates(res.data);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const handleRangeSelection = (value: Date | [Date | null, Date | null] | null) => {
    if (Array.isArray(value) && value[0] && value[1]) {
      const [start, end] = value;
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const price = pricePerNight ? nights * pricePerNight : null;
      const confirm = window.confirm(
        `¿Confirmas bloquear ${nights} noche(s) del ${start.toDateString()} al ${end.toDateString()}${price ? ` por un total de $${price}` : ''}?`
      );
      if (confirm) {
        blockRange(start, end);
        setRange(null);
      }
    } else {
      setRange(null);
    }
  };

  const blockRange = async (start: Date, end: Date) => {
    const current = new Date(start);
    while (current <= end) {
      try {
        const iso = current.toISOString();
        const exists = dates.some(
          (d) => new Date(d.date).toDateString() === current.toDateString()
        );
        if (!exists) {
          const res = await api.post<CalendarType>('/calendar', {
            propertyId,
            date: iso,
          });
          setDates((prev) => [...prev, res.data]);
        }
      } catch (err) {
        console.error('Error bloqueando fecha:', err);
      }
      current.setDate(current.getDate() + 1);
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const isUnavailable = dates.some(
        (d) => new Date(d.date).toDateString() === date.toDateString()
      );
      return isUnavailable ? 'unavailable-date' : null;
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Bloquear fechas (click para rango)</h4>
        <Calendar
        selectRange
        value={range ?? undefined}
        onChange={handleRangeSelection}
        tileClassName={tileClassName}
        />

      <style jsx>{`
        .unavailable-date {
          background: #e2e8f0;
          text-decoration: line-through;
          color: #a0aec0;
        }
      `}</style>
    </div>
  );
}
