/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import api from '@/lib/api';
import type { Calendar as CalendarType } from '../../../../shared/types/calendar';
import { baseCalendarClassName, baseCalendarModifiersClassNames } from "@/app/calendarStyles";
import { confirmDialog } from './ConfrimDialog';

interface Props {
  propertyId: number;
  pricePerNight?: number;
}

export default function CalendarManager({ propertyId, pricePerNight }: Props) {
  const [dates, setDates] = useState<CalendarType[]>([]);
  const [selection, setSelection] = useState<{ from?: Date; to?: Date }>({});
  const [isUnblockMode, setIsUnblockMode] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);


  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    try {
      const res = await api.get<CalendarType[]>(`/calendar/${propertyId}`);
      setDates(res.data);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const applyDateRange = async (start: Date, end: Date, isUnblock: boolean) => {
    let from = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    let to = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    if (from > to) [from, to] = [to, from];

      const current = new Date(from);
      while (isUnblock ? current <= to : current < to) {
      const localDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
      const isoDate = localDate.toISOString().split('T')[0];

      if (isUnblock) {
        try {
          const exists = dates.find(
            (d) => new Date(d.date).toDateString() === localDate.toDateString()
          );
          if (exists) {
            await api.delete(`/calendar/${propertyId}/${isoDate}`);
            setDates((prev) =>
              prev.filter((d) => {
                const dbDate = new Date(d.date).toISOString().split('T')[0];
                return dbDate !== isoDate;
              })
            );
          }
        } catch (err) {
          console.error('Error desbloqueando fecha:', err);
        }
      } else {
        try {
          const exists = dates.some(
            (d) => new Date(d.date).toDateString() === localDate.toDateString()
          );
          if (!exists) {
            const res = await api.post<CalendarType>('/calendar', {
              propertyId,
              date: localDate.toISOString(),
            });
            setDates((prev) => [...prev, res.data]);
          }
        } catch (err) {
          console.error('Error bloqueando fecha:', err);
        }
      }

      current.setDate(current.getDate() + 1);
    }
  };

  const handleDayClick = async (date: Date) => {
    
    const isBlocked = dates.some(
      (d) => new Date(d.date).toDateString() === date.toDateString()
    );

    if (!isUnblockMode && isBlocked) {
      return;
    }

    if (isUnblockMode && !isBlocked) {
      return;
    }
    
    if (!selection.from) {
      setSelection({ from: date });
      return;
    }

    const from = new Date(selection.from.getFullYear(), selection.from.getMonth(), selection.from.getDate());
    const to = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const nights = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
    
    const price = pricePerNight && !isUnblockMode ? nights * pricePerNight : null;

    const confirmAction = await confirmDialog({
      message: isUnblockMode
        ? `¿Confirmás desbloquear del ${from.toDateString()} al ${to.toDateString()} (incluyendo el último día seleccionado)?`
        : `¿Confirmás bloquear ${nights} noche(s) del ${from.toDateString()} al ${to.toDateString()} (día de salida: ${to.toDateString()})${
            price ? ` por un total de $${price}` : ''
          }?`,
      confirmLabel: isUnblockMode ? 'Desbloquear' : 'Bloquear',
      cancelLabel: 'Cancelar',
    });

    if (confirmAction) {
      applyDateRange(from, to, isUnblockMode);
    }

    setSelection({});
  };

  const pendingRange =
    selection.from && hoveredDate
       ? {
         from: selection.from < hoveredDate ? selection.from : hoveredDate,
         to: selection.from > hoveredDate ? selection.from : hoveredDate,
        }
      : undefined;

  const getBlockedDates = () => {
    return dates
      .map((d) => {
        const date = new Date(d.date);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      })
      .filter((d) => !isNaN(d.getTime()));
  };

  const rangeClassName = isUnblockMode
  ? "bg-[#E2F2F9] text-[#1A5E8D] font-semibold border border-dashed border-[#1A5E8D]"
  : "bg-[#A8D8E8] text-[#1A5E8D] font-semibold";


return (
  <div className="mt-4 custom-calendar">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-[#1A5E8D]">Calendario de disponibilidad</h4>
      <label className="flex items-center gap-2 text-sm text-[#1A5E8D]">
        <input
          type="checkbox"
          checked={isUnblockMode}
          onChange={() => {
            setIsUnblockMode(!isUnblockMode);
            setSelection({});
          }}
        />
        Modo desbloqueo
      </label>
    </div>

    <DayPicker
      mode="single"
      selected={undefined}
      onDayClick={handleDayClick}
      onDayMouseEnter={(date) => setHoveredDate(date)}
      onDayMouseLeave={() => setHoveredDate(undefined)}
      numberOfMonths={1}
      pagedNavigation
      modifiers={{
        blocked: getBlockedDates(),
        pendingRange, 
      }}
      modifiersClassNames={{
        ...baseCalendarModifiersClassNames,
        blocked: "unavailable-date",
        pendingRange: rangeClassName,
        selected: "bg-[#1A5E8D] text-white font-bold",
      }}
      classNames={{
        ...baseCalendarClassName,
        day_selected: "text-white bg-[#1A5E8D] font-bold",
      }}
    />


    <style>{`
      .unavailable-date {
        background: transparent;
        color: #1A5E8D;
        opacity: 0.5;
        text-decoration: line-through;
        font-weight: normal;
      }
    `}</style>
  </div>
);

}
